#!/usr/bin/env node
/**
 * M15 §2: CI fails when code references an i18n key missing from the `en` catalogue.
 * Checks literal keys in t('…') calls and in Zod messages of schemas.ts (namespaced `ns:key`
 * or resolved in the file's namespace, then `common`).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const localeDir = join(root, 'src/locales/en');
const catalogues = Object.fromEntries(
  readdirSync(localeDir).map((f) => [f.replace(/\.json$/, ''), JSON.parse(readFileSync(join(localeDir, f), 'utf8'))]),
);

const has = (ns, key) =>
  key.split('.').reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), catalogues[ns]) !==
  undefined;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!['generated', 'locales', 'test', 'mocks', '__tests__'].includes(name)) yield* files(p);
    } else if (/\.(ts|tsx)$/.test(name) && !/\.(test|stories)\.tsx?$/.test(name)) yield p;
  }
}

const missing = [];
for (const file of files(join(root, 'src'))) {
  const src = readFileSync(file, 'utf8');
  const ns = /(?:useTranslation\(\s*|TFunction<)'([\w-]+)'/.exec(src)?.[1] ?? 'common';
  const keys = [...src.matchAll(/\bt\(\s*'([\w.:-]+)'/g)].map((m) => m[1]);
  if (file.endsWith('schemas.ts'))
    keys.push(...[...src.matchAll(/'((?:[\w-]+:)?(?:validation|password|mfa)\.[\w.]+)'/g)].map((m) => m[1]));
  for (const raw of keys) {
    const [explicitNs, key] = raw.includes(':') ? raw.split(':') : [null, raw];
    const ok = explicitNs
      ? has(explicitNs, key)
      : has(ns, key) || has('common', key) || (file.endsWith('schemas.ts') && has('auth', key));
    if (!ok) missing.push(`${relative(root, file)}: ${raw}`);
  }
}

if (missing.length) {
  console.error(`Missing en i18n keys:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log('i18n: all referenced keys exist in en');
