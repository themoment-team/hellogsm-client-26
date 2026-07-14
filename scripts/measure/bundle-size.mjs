/**
 * 클라이언트 전송 JS 번들 크기 측정 (T1부터 사용).
 *
 * Next 16(Turbopack)은 빌드 출력에서 라우트별 First Load JS 표를 제거했으므로,
 * `.next/static` 아래 JS 파일 크기 합산으로 앱별 총량을 기록한다.
 * T1 vs T2(컴파일러 ON) 비교는 이 동일한 방식으로 수행해야 유효하다.
 * (T0의 First Load JS 표와는 산정 방식이 달라 직접 비교 불가 — 참고용으로만)
 *
 * Usage: node scripts/measure/bundle-size.mjs <label>   (사전 조건: pnpm build 완료)
 */
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const label = process.argv[2];
if (!label) {
  console.error('Usage: node scripts/measure/bundle-size.mjs <label>');
  process.exit(1);
}

const root = process.cwd();

const collectJs = (dir, acc = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectJs(full, acc);
    else if (entry.name.endsWith('.js')) acc.push({ path: full, bytes: statSync(full).size });
  }
  return acc;
};

const result = { label, date: new Date().toISOString(), method: 'sum of .next/static/**/*.js bytes', apps: {} };

for (const app of ['client', 'admin']) {
  const staticDir = join(root, 'apps', app, '.next', 'static');
  const files = collectJs(staticDir);
  const totalBytes = files.reduce((a, f) => a + f.bytes, 0);
  result.apps[app] = {
    files: files.length,
    totalBytes,
    totalKB: Math.round(totalBytes / 1024),
  };
  console.log(`[${app}] ${files.length} js files, ${(totalBytes / 1024).toFixed(0)} KB`);
}

const outDir = join(root, 'docs', 'measurements', label);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'bundle-size.json'), JSON.stringify(result, null, 2));
console.log(`-> docs/measurements/${label}/bundle-size.json`);
