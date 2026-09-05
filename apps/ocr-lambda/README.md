# @repo/ocr-lambda

생기부 OCR을 Vercel 서버리스 함수가 아니라 AWS Lambda 컨테이너 이미지에서 돌린다.

## 왜 옮겼나

`kordoc`의 OCR 경로는 `onnxruntime-node`·`sharp`·`@napi-rs/canvas` 같은 플랫폼 네이티브
바이너리를 필요로 한다. Vercel 서버리스 함수는 압축 해제 기준 250MB 크기 제한이 있는데,
이 바이너리들을 배포 번들에 포함시키려는 여러 시도(`outputFileTracingIncludes` 글롭 패턴,
직접 의존성 승격 등)가 매번 다른 방식으로 실패했다 — 크기 초과, 심볼릭 링크 거부, 모듈
해석 실패 등. Lambda 컨테이너 이미지는 최대 10GB까지 허용해 이 제약이 사실상 없다.

## 아키텍처

```
브라우저 → S3 업로드 (presigned URL)
브라우저 → Vercel /api/school-record-ocr (세션 인증)
                ↓ objectKey만 전달, 동기 호출(RequestResponse)
              Lambda (컨테이너 이미지)
                ↓ S3에서 원본 PDF 다운로드
                ↓ kordoc.parse({ ocr: true, tables: true })
                ↓ convertKordocBlocks
                ← { success, rawText, ... } 반환
              Vercel이 결과를 { code, data, message, status } 형식으로 감싸 응답
```

인증·요청 검증(`isAuthenticated`)은 계속 Vercel 라우트에서 한다 — Lambda는 `objectKey`
하나만 받는 순수 처리기라 별도 인증이 없다. Lambda를 인터넷에 직접 노출하지 않고 항상
Vercel을 통해서만(IAM 자격 증명으로 `lambda:InvokeFunction`) 호출되게 해야 한다.

## 로컬 빌드/타입체크

일반 워크스페이스 패키지와 동일하다.

```bash
pnpm --filter @repo/ocr-lambda build
pnpm --filter @repo/ocr-lambda check-types
pnpm --filter @repo/ocr-lambda lint
```

## 배포

### 0. 사전 준비

- AWS CLI, Docker 설치 및 로그인
- S3 버킷과 같은 리전(`ap-northeast-2`) 사용 — 리전이 다르면 데이터 전송 지연·비용이 늘어난다.
- 아래 명령은 예시이며 `<...>` 부분을 실제 값으로 바꿔서 실행한다.
- 아래 버킷명(`hellogsm-dev-bucket`)·prefix(`ocr-uploads/`)는 백엔드팀에서 확인해준 **stage/dev
  전용** 값이다. 운영(prod) 배포 시에는 별도 버킷명을 다시 확인해서 IAM 정책·환경변수를
  바꿔야 한다.

### 1. ECR 리포지토리 생성 (최초 1회)

```bash
aws ecr create-repository \
  --repository-name ocr-lambda \
  --region ap-northeast-2
```

### 2. Docker 이미지 빌드 & 푸시

**반드시 저장소 루트에서** 빌드한다 — `turbo prune`이 전체 워크스페이스를 봐야 한다.

```bash
# 저장소 루트에서 실행
export AWS_ACCOUNT_ID=<계정 ID>
export ECR_URI=$AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/ocr-lambda

aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin $ECR_URI

docker build --platform linux/amd64 -f apps/ocr-lambda/Dockerfile -t $ECR_URI:latest .
docker push $ECR_URI:latest
```

`--platform linux/amd64`를 빼먹지 말 것 — Apple Silicon 맥에서 그냥 빌드하면 arm64 이미지가
되어 Lambda(기본 x86_64) 배포 시 아키텍처 불일치로 실패한다. Graviton(arm64) Lambda로
가려면 이 플래그와 Lambda 함수의 `--architectures arm64`를 함께 바꿔야 한다.

### 3. IAM — Lambda 실행 역할

Lambda가 S3에서 원본 PDF를 읽을 수 있는 최소 권한만 부여한다.

```bash
# 신뢰 정책
cat > trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "lambda.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
  --role-name ocr-lambda-execution-role \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \
  --role-name ocr-lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# S3 GetObject를 실제 업로드 prefix로만 좁힌다
cat > s3-read-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::hellogsm-dev-bucket/ocr-uploads/*"
  }]
}
EOF

aws iam put-role-policy \
  --role-name ocr-lambda-execution-role \
  --policy-name ocr-lambda-s3-read \
  --policy-document file://s3-read-policy.json
```

### 4. Lambda 함수 생성

17페이지짜리 실제 생기부 PDF로 측정한 값이 아니라 시작점이다 — 처음 실행 후 CloudWatch에서
실제 실행 시간·메모리 사용량을 보고 조정한다.

```bash
aws lambda create-function \
  --function-name ocr-lambda \
  --package-type Image \
  --code ImageUri=$ECR_URI:latest \
  --role arn:aws:iam::$AWS_ACCOUNT_ID:role/ocr-lambda-execution-role \
  --timeout 120 \
  --memory-size 4096 \
  --region ap-northeast-2 \
  --environment "Variables={AWS_S3_BUCKET=hellogsm-dev-bucket,KORDOC_MODEL_CACHE=/tmp/kordoc-models,NODE_ENV=production}"
```

`NODE_ENV=production`은 필수에 가깝다 — 꺼두면 생기부 원문 내용이 디버그 로그로
CloudWatch에 그대로 남는다(`achievementTextConverter.ts`의 `kordocDebug` 참고).

업데이트할 때는:

```bash
docker build --platform linux/amd64 -f apps/ocr-lambda/Dockerfile -t $ECR_URI:latest .
docker push $ECR_URI:latest
aws lambda update-function-code \
  --function-name ocr-lambda \
  --image-uri $ECR_URI:latest
```

### 5. Vercel → Lambda 호출 권한

Vercel의 AWS 자격 증명(S3 업로드/다운로드용으로 이미 있는 것)에 이 Lambda 함수 하나만
호출할 수 있는 권한을 추가한다 — 장기 액세스 키를 새로 하나 더 만드는 대신, 기존 IAM
사용자의 정책에 아래를 좁게 추가하는 편이 관리 포인트가 줄어든다.

```bash
cat > lambda-invoke-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "lambda:InvokeFunction",
    "Resource": "arn:aws:lambda:ap-northeast-2:<계정 ID>:function:ocr-lambda"
  }]
}
EOF

aws iam put-user-policy \
  --user-name <Vercel이 쓰는 IAM 사용자명> \
  --policy-name ocr-lambda-invoke \
  --policy-document file://lambda-invoke-policy.json
```

### 6. Vercel 환경변수

- `OCR_LAMBDA_FUNCTION_NAME=ocr-lambda` (Production/Preview 둘 다) 추가
- 기존 `KORDOC_MODEL_CACHE`, `ONNXRUNTIME_NODE_INSTALL`은 Vercel에서 더 이상 필요 없다 —
  Lambda 함수 자체의 환경변수로 옮겨졌으니 Vercel 프로젝트 설정에서 지워도 된다.
- `AWS_S3_BUCKET`도 Vercel 라우트가 더 이상 S3에서 직접 파일을 받지 않으므로 지워도 된다
  (Lambda 쪽 환경변수로만 필요).
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`는 계속 필요하다(Lambda 호출용).
