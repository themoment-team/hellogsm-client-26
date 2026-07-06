/**
 * Stage 2(flat config 전환) 룰 동등성 검증용 lint 진단 스냅샷.
 *
 * 워크스페이스 9개 대상에서 `eslint src --format json`을 실행해
 * 원본 JSON과 diff 가능한 요약(summary.txt: pkg|file:line:col|rule|severity 정렬)을
 * scripts/measure/results/stage2-lint-parity/<label>/ 에 저장한다.
 *
 * Usage: node scripts/measure/lint-snapshot.mjs <before|after>
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const label = process.argv[2];
if (!label) {
  console.error('Usage: node scripts/measure/lint-snapshot.mjs <label>');
  process.exit(1);
}

const root = process.cwd();
const outDir = join(root, 'scripts', 'measure', 'results', 'stage2-lint-parity', label);
mkdirSync(outDir, { recursive: true });

const targets = [
  'apps/client',
  'apps/admin',
  'packages/api',
  'packages/constants',
  'packages/hooks',
  'packages/store',
  'packages/types',
  'packages/ui',
  'packages/utils',
];

const summaryLines = [];

for (const target of targets) {
  const pkgDir = join(root, target);
  const pkgName = target.replace('/', '__');

  const res = spawnSync('npx', ['eslint', 'src', '--format', 'json'], {
    cwd: pkgDir,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });

  // eslint는 룰 위반(에러)이 있으면 exit 1을 반환하므로 stdout이 JSON이면 정상 진행
  let results;
  try {
    results = JSON.parse(res.stdout);
  } catch {
    console.error(`[${target}] eslint 실행 실패 (exit ${res.status})`);
    console.error(res.stderr?.slice(-2000));
    process.exit(1);
  }

  writeFileSync(join(outDir, `${pkgName}.json`), JSON.stringify(results, null, 2));

  let count = 0;
  for (const file of results) {
    const rel = relative(pkgDir, file.filePath).split(sep).join('/');
    for (const m of file.messages) {
      summaryLines.push(
        `${target}|${rel}:${m.line}:${m.column}|${m.ruleId ?? '(parse)'}|sev${m.severity}`,
      );
      count += 1;
    }
  }
  console.log(`[${target}] ${count} diagnostics`);
}

summaryLines.sort();
writeFileSync(join(outDir, 'summary.txt'), summaryLines.join('\n') + '\n');
console.log(`\n[${label}] total ${summaryLines.length} diagnostics -> ${outDir}`);
