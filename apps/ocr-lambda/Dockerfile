# syntax=docker/dockerfile:1
#
# 이 monorepo(pnpm + turbo)에서 @repo/ocr-lambda 패키지 하나만 빌드에 필요한 만큼만
# 잘라내(pruner) 설치·빌드(installer)한 뒤, 실제 실행은 AWS Lambda의 공식 Node.js 런타임
# 이미지(runner)로 옮겨 담는다. Lambda 런타임 이미지는 Amazon Linux 기반 glibc라, pruner/
# installer 단계는 리눅스 배포판이 달라도(Debian) 상관없다 — @napi-rs/canvas·onnxruntime-node·
# sharp의 네이티브 바이너리는 npm이 "linux-x64-gnu" 플랫폼 패키지를 그대로 내려받는 것이지
# 로컬에서 컴파일하는 게 아니기 때문이다. glibc 계열이기만 하면 어디서 설치하든 동일한
# 바이너리가 받아진다 — 반대로 alpine(musl) 기반 이미지를 쓰면 잘못된(musl용) 바이너리가
# 받아져 Lambda(glibc)에서 로드가 실패하므로 절대 alpine을 쓰면 안 된다.
#
# Node 20 → 22: kordoc이 컴파일해둔 코드가 pdfjs-dist(ESM 전용 모듈)를 require()로
# 불러오는데, Node 20은 CJS에서 ESM을 require()로 로드하는 걸 지원하지 않아
# ERR_REQUIRE_ESM으로 항상 실패했다(실제 Lambda에서 재현·확인됨). Node 22.12+부터는
# require()가 조건을 만족하는 ESM 모듈을 동기적으로 로드할 수 있어(require(esm)) 코드
# 변경 없이 이 문제가 해결된다.
FROM node:22-bookworm AS base
RUN corepack enable && corepack prepare pnpm@10.30.2 --activate
RUN npm install -g turbo@2.8.9

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @repo/ocr-lambda --docker

FROM base AS installer
WORKDIR /app
# onnxruntime-node의 postinstall 스크립트는 기본적으로 GPU(CUDA) 실행 공급자 바이너리까지
# 별도로 내려받으려 하는데, Lambda는 CPU로만 추론하므로 전혀 필요 없다 — 켜둔 채로 두면
# onnxruntime-node 하나만 300MB 가까이 불어난다(Vercel 배포에서 실제로 겪은 문제).
ENV ONNXRUNTIME_NODE_INSTALL=skip
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@repo/ocr-lambda
# pnpm의 node_modules는 상대 심볼릭 링크로 pnpm 가상 저장소(../../../node_modules/.pnpm/...)를
# 가리키는데, 이 상대 경로는 "지금 이 디렉터리 깊이"를 기준으로 계산된 것이다. apps/ocr-lambda/
# node_modules만 떼어 ${LAMBDA_TASK_ROOT}처럼 전혀 다른 깊이의 디렉터리로 복사하면, 예를 들어
# kordoc 심볼릭 링크가 원래 가리키던 /app/node_modules/.pnpm/... 대신 존재하지 않는
# /node_modules/.pnpm/...를 가리키게 되어 런타임에 require("kordoc")가 깨진다(리뷰 지적,
# 로컬에서 직접 재현·확인함). `pnpm deploy`는 이 문제를 위해 만들어진 공식 명령어로, 심볼릭
# 링크가 전부 같은 node_modules 안에서만(예: node_modules/kordoc -> node_modules/.pnpm/...)
# 상대 경로를 쓰도록 배포 디렉터리를 만들어준다 — 어느 깊이로 옮겨도 깨지지 않는다.
RUN pnpm --filter=@repo/ocr-lambda deploy --prod --legacy /app/deploy

FROM public.ecr.aws/lambda/nodejs:22 AS runner
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=installer /app/deploy/dist ./
COPY --from=installer /app/deploy/node_modules ./node_modules
CMD ["handler.handler"]
