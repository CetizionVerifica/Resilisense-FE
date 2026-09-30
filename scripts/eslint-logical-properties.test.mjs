import { findPhysicalUtility } from './eslint-logical-properties.js';

describe('logical-properties lint rule', () => {
  it.each([
    ['ml-2', 'ml-2'],
    ['flex pr-4 gap-2', 'pr-4'],
    ['md:hover:pl-[3px]', 'md:hover:pl-[3px]'],
    ['-mr-1', '-mr-1'],
    ['absolute left-0', 'left-0'],
    ['text-right', 'text-right'],
    ['rounded-tl-md', 'rounded-tl-md'],
    ['border-l', 'border-l'],
    ['border-l-2', 'border-l-2'],
  ])('flags %j', (value, found) => {
    expect(findPhysicalUtility(value)).toBe(found);
  });

  it.each([
    'ms-2 me-4 ps-1 pe-2',
    'start-0 end-0',
    'text-start',
    'rounded-s-md border-s-2',
    'html',
    'rightmost',
    'overflow-x-auto',
  ])('allows %j', (value) => {
    expect(findPhysicalUtility(value)).toBeNull();
  });
});
