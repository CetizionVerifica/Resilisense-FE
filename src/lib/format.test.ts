import { describeUserAgent, formatDate, formatRelative } from './format';

const now = new Date('2026-09-30T12:00:00Z');

describe('formatRelative', () => {
  it('uses the largest fitting unit', () => {
    expect(formatRelative('2026-09-30T10:00:00Z', 'en', now)).toBe('2 hours ago');
    expect(formatRelative('2026-09-29T12:00:00Z', 'en', now)).toBe('yesterday');
    expect(formatRelative('2026-09-30T11:59:40Z', 'en', now)).toBe('this minute');
  });
});

describe('formatDate', () => {
  it('formats in the locale and time zone', () => {
    expect(formatDate('2026-09-30T23:30:00Z', 'en-GB', 'UTC')).toBe('30 Sept 2026');
    expect(formatDate('2026-09-30T23:30:00Z', 'en-GB', 'Europe/Bucharest')).toBe('1 Oct 2026');
  });
});

describe('describeUserAgent', () => {
  it.each([
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129.0 Safari/537.36 Edg/129.0',
      'Edge',
      'Windows',
    ],
    [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile Safari/604.1',
      'Safari',
      'iOS',
    ],
    ['Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0', 'Firefox', 'Linux'],
  ])('%s', (ua, browser, os) => {
    expect(describeUserAgent(ua)).toEqual({ browser, os });
  });
  it('returns nothing for unknown agents', () => {
    expect(describeUserAgent('curl/8.0')).toEqual({});
  });
});
