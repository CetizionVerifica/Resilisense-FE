#!/usr/bin/env node
/**
 * Pulls the backend contract (ADR-009): copies CSR_BE's openapi.json at the pinned ref into
 * api/openapi.json, then regenerates src/api with orval.
 *
 *   npm run api:sync                 # re-fetch the pinned ref (api/openapi.lock.json)
 *   npm run api:sync -- --ref main   # move the pin to a new branch/tag/commit
 *
 * Source, in order: a local CSR_BE checkout (CSR_BE_DIR, default ../CSR_BE) via `git show`,
 * else the GitHub contents API (GITHUB_TOKEN for the private repo).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = join(root, 'api', 'openapi.lock.json');
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
const { values } = parseArgs({ options: { ref: { type: 'string' } } });
const requested = values.ref ?? lock.ref;

function fromLocal() {
  const dir = resolve(root, process.env.CSR_BE_DIR ?? '../CSR_BE');
  if (!existsSync(join(dir, '.git'))) return null;
  try {
    execFileSync('git', ['-C', dir, 'fetch', '-q', 'origin', requested], { stdio: 'ignore' });
  } catch {
    // offline or the ref is already local
  }
  for (const rev of [`origin/${requested}`, requested]) {
    try {
      const sha = execFileSync('git', ['-C', dir, 'rev-parse', '--verify', `${rev}^{commit}`])
        .toString()
        .trim();
      const body = execFileSync('git', ['-C', dir, 'show', `${sha}:${lock.path}`]).toString();
      return { sha, body };
    } catch {
      // try the next form
    }
  }
  return null;
}

async function fromGitHub() {
  const headers = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const api = `https://api.github.com/repos/${lock.repository}`;
  const commit = await fetch(`${api}/commits/${encodeURIComponent(requested)}`, { headers });
  if (!commit.ok)
    throw new Error(`GitHub: cannot resolve ${requested} (status ${commit.status}); set GITHUB_TOKEN or CSR_BE_DIR`);
  const { sha } = await commit.json();
  const file = await fetch(`${api}/contents/${lock.path}?ref=${sha}`, {
    headers: { ...headers, accept: 'application/vnd.github.raw' },
  });
  if (!file.ok) throw new Error(`GitHub: cannot read ${lock.path}@${sha} (status ${file.status})`);
  return { sha, body: await file.text() };
}

const result = fromLocal() ?? (await fromGitHub());
JSON.parse(result.body); // must be valid JSON
writeFileSync(join(root, 'api', 'openapi.json'), result.body);
writeFileSync(lockPath, `${JSON.stringify({ ...lock, ref: result.sha }, null, 2)}\n`);
console.log(`api/openapi.json ← ${lock.repository}@${result.sha.slice(0, 12)}`);
execFileSync('npm', ['run', '-s', 'api:generate'], { cwd: root, stdio: 'inherit' });
