import { returnPath } from './guards';

describe('returnPath (post sign-in redirect)', () => {
  it.each([
    [{ from: '/settings/security?tab=x' }, '/settings/security?tab=x'],
    [{ from: '//evil.example' }, '/'],
    [{ from: '/\\evil.example' }, '/'],
    [{ from: '/a\\b' }, '/'],
    [{ from: 'https://evil.example' }, '/'],
    [{ from: 42 }, '/'],
    [null, '/'],
  ])('%j → %s', (state, expected) => {
    expect(returnPath(state)).toBe(expected);
  });
});
