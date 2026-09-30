/**
 * Pseudo-locale `en-XA` (M15 §4): accented letters + ~30 % expansion, keeping ICU arguments
 * intact. Text lives at even brace depth; `{name}` / `{count, plural, …}` syntax at odd depth.
 */
const MAP: Record<string, string> = {
  a: 'á',
  b: 'ƀ',
  c: 'ç',
  d: 'ð',
  e: 'é',
  f: 'ƒ',
  g: 'ĝ',
  h: 'ĥ',
  i: 'í',
  j: 'ĵ',
  k: 'ķ',
  l: 'ĺ',
  m: 'ɱ',
  n: 'ñ',
  o: 'ó',
  p: 'þ',
  q: 'ǫ',
  r: 'ŕ',
  s: 'š',
  t: 'ţ',
  u: 'ú',
  v: 'ṽ',
  w: 'ŵ',
  x: 'ẋ',
  y: 'ý',
  z: 'ž',
  A: 'Á',
  B: 'Ɓ',
  C: 'Ç',
  D: 'Ð',
  E: 'É',
  F: 'Ƒ',
  G: 'Ĝ',
  H: 'Ĥ',
  I: 'Í',
  J: 'Ĵ',
  K: 'Ķ',
  L: 'Ĺ',
  M: 'Ṁ',
  N: 'Ñ',
  O: 'Ó',
  P: 'Þ',
  Q: 'Ǫ',
  R: 'Ŕ',
  S: 'Š',
  T: 'Ţ',
  U: 'Ú',
  V: 'Ṽ',
  W: 'Ŵ',
  X: 'Ẋ',
  Y: 'Ý',
  Z: 'Ž',
};

export function pseudoLocalize(message: string): string {
  let depth = 0;
  let out = '';
  let letters = 0;
  for (const ch of message) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    const inText = depth % 2 === 0 && ch !== '{' && ch !== '}';
    if (inText && MAP[ch]) {
      out += MAP[ch];
      letters++;
    } else out += ch;
  }
  return `[${out}${'~'.repeat(Math.ceil(letters * 0.3))}]`;
}

type Tree = { [key: string]: string | Tree };

export function pseudoLocalizeTree(tree: Tree): Tree {
  return Object.fromEntries(
    Object.entries(tree).map(([k, v]) => [k, typeof v === 'string' ? pseudoLocalize(v) : pseudoLocalizeTree(v)]),
  );
}
