/**
 * RTL safety (02 §8, M15 §2): forbid physical Tailwind utilities in class strings.
 * Use logical ones instead: ms-/me-/ps-/pe-/start-/end-/text-start/text-end/rounded-s-/border-s-…
 */
const PHYSICAL =
  /(?:^|[\s"'`])(?:[\w-]+:)*!?-?(?:ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|scroll-ml|scroll-mr|scroll-pl|scroll-pr)-[\w./[\]-]+|(?:^|[\s"'`])(?:[\w-]+:)*(?:text-left|text-right|float-left|float-right|clear-left|clear-right|border-l|border-r)(?=$|[\s"'`])/;

const LOGICAL = {
  ml: 'ms',
  mr: 'me',
  pl: 'ps',
  pr: 'pe',
  left: 'start',
  right: 'end',
  'text-left': 'text-start',
  'text-right': 'text-end',
};

/** @param {string} value */
export function findPhysicalUtility(value) {
  const m = PHYSICAL.exec(value);
  return m ? m[0].trim().replace(/^["'`]/, '') : null;
}

/** @type {import('eslint').Rule.RuleModule} */
export const logicalProperties = {
  meta: {
    type: 'problem',
    docs: { description: 'Use logical (RTL-safe) Tailwind utilities instead of physical ones' },
    schema: [],
    messages: {
      physical: '"{{found}}" is not RTL-safe; use the logical utility (e.g. {{hint}}).',
    },
  },
  create(context) {
    /** @param {import('estree').Node} node @param {string} value */
    const check = (node, value) => {
      const found = findPhysicalUtility(value);
      if (!found) return;
      const base = found.replace(/^(?:[\w-]+:)*!?-?/, '').split('-')[0] ?? '';
      const hint = LOGICAL[found.replace(/^(?:[\w-]+:)*/, '')] ?? LOGICAL[base] ?? 'ms-/me-/ps-/pe-/start-/end-';
      context.report({ node, messageId: 'physical', data: { found, hint } });
    };
    return {
      Literal(node) {
        if (typeof node.value === 'string') check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};
