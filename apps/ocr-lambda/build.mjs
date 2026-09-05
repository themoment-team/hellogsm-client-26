import * as esbuild from 'esbuild';

// @repo/constants는 컴파일되지 않은 TypeScript 소스(src/index.ts)를 그대로 내보내는
// 워크스페이스 패키지다(Next.js처럼 번들러가 있는 소비자를 전제로 한 설계) — Lambda
// 런타임은 plain Node라 번들러 없이 이 패키지를 직접 require하면 실패한다(.ts 확장자를
// 못 찾음). esbuild로 번들링해서 @repo/constants를 handler.js 안에 그대로 inline시킨다.
//
// kordoc과 @aws-sdk/client-s3는 external로 남긴다 — kordoc은 onnxruntime-node/sharp/
// @napi-rs/canvas 같은 네이티브 바이너리(.node/.so)를 옵셔널 의존성으로 가지고 있는데,
// esbuild는 이런 네이티브 바이너리를 번들에 담을 수 없다. 이 패키지들은 Dockerfile이
// node_modules를 그대로 복사해 런타임에 평소처럼 require되게 한다.
await esbuild.build({
  entryPoints: ['src/handler.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  outfile: 'dist/handler.js',
  external: ['kordoc', '@aws-sdk/client-s3'],
  logLevel: 'info',
});
