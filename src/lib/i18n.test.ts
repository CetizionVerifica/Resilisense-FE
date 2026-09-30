import { detectLocale, directionOf, i18n } from './i18n';
import { pseudoLocalize } from './pseudo-locale';

describe('i18n', () => {
  it.each([
    ['en', 'ltr'],
    ['ar', 'rtl'],
    ['ar-EG', 'rtl'],
    ['he', 'rtl'],
    ['de', 'ltr'],
  ])('%s is %s', (locale, dir) => {
    expect(directionOf(locale)).toBe(dir);
  });

  it('falls back to English for unsupported browser languages', () => {
    expect(detectLocale(['fr-FR', 'de'])).toBe('en');
    expect(detectLocale(['en-GB'])).toBe('en');
  });

  it('formats ICU messages', () => {
    expect(i18n.t('home.welcome', { name: 'Ada' })).toBe('Welcome, Ada');
  });

  it('pseudo-localises text but keeps ICU arguments intact', () => {
    expect(pseudoLocalize('Hello {name}')).toBe('[Ĥéĺĺó {name}~~]');
    const plural = pseudoLocalize('{count, plural, one {# file} other {# files}}');
    expect(plural).toContain('{count, plural, one {# ƒíĺé} other {# ƒíĺéš}}');
  });

  it('sets <html lang dir> on language change', async () => {
    await i18n.changeLanguage('en-XA');
    expect(document.documentElement.lang).toBe('en-XA');
    expect(document.documentElement.dir).toBe('ltr');
    await i18n.changeLanguage('en');
  });
});
