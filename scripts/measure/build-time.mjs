/**
 * Build time measurement script for the React Compiler migration (T0~T3).
 *
 * Runs `pnpm build --force` N times (turbo cache bypassed), removing every
 * `.next` directory before each run so all iterations are comparable cold builds.
 * Results are written to docs/measurements/<label>/build-times.json and
 * the full build output of the last run is saved for the route/bundle table.
 *
 * Usage: node scripts/measure/build-time.mjs <label> [iterations]
 *   e.g. node scripts/measure/build-time.mjs T0 10
 */
import { execSync, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const label = process.argv[2];
const iterations = Number(process.argv[3] ?? 10);
if (!label) {
  console.error('Usage: node scripts/measure/build-time.mjs <label> [iterations]');
  process.exit(1);
}

const root = process.cwd();
const resultsDir = join(root, 'docs', 'measurements', label);
mkdirSync(resultsDir, { recursive: true });

const nextDirs = ['apps/client/.next', 'apps/admin/.next'].map((p) => join(root, p));

const times = [];
let lastOutput = '';

for (let i = 1; i <= iterations; i++) {
  for (const dir of nextDirs) {
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  }

  console.log(`[${label}] build ${i}/${iterations} ...`);
  const start = Date.now();
  const res = spawnSync('pnpm', ['build', '--force'], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const elapsed = (Date.now() - start) / 1000;

  if (res.status !== 0) {
    console.error(`[${label}] build ${i} FAILED (exit ${res.status})`);
    console.error(res.stdout?.slice(-4000));
    console.error(res.stderr?.slice(-4000));
    process.exit(1);
  }

  lastOutput = `${res.stdout ?? ''}\n${res.stderr ?? ''}`;
  times.push(elapsed);
  console.log(`[${label}] build ${i}/${iterations}: ${elapsed.toFixed(1)}s`);
}

const avg = times.reduce((a, b) => a + b, 0) / times.length;
const sorted = [...times].sort((a, b) => a - b);
const median =
  sorted.length % 2 === 1
    ? sorted[(sorted.length - 1) / 2]
    : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

const result = {
  label,
  commit: execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(),
  date: new Date().toISOString(),
  node: process.version,
  iterations,
  protocol: 'rm apps/*/.next before each run, pnpm build --force (turbo cache bypassed)',
  timesSeconds: times.map((t) => Number(t.toFixed(1))),
  avgSeconds: Number(avg.toFixed(1)),
  medianSeconds: Number(median.toFixed(1)),
  minSeconds: Number(sorted[0].toFixed(1)),
  maxSeconds: Number(sorted[sorted.length - 1].toFixed(1)),
};

writeFileSync(join(resultsDir, 'build-times.json'), JSON.stringify(result, null, 2));
writeFileSync(join(resultsDir, 'last-build-output.txt'), lastOutput);

console.log(
  `\n[${label}] done. avg=${result.avgSeconds}s median=${result.medianSeconds}s (commit ${result.commit})`,
);
console.log(`Results written to docs/measurements/${label}/`);
