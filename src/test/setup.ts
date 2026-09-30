import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { authToken } from '@/lib/auth-token';
import { initI18n } from '@/lib/i18n';
import { resetMockState } from '@/mocks/handlers';
import { server } from './server';

beforeAll(async () => {
  server.listen({ onUnhandledFrame: 'error' });
  await initI18n('en');
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockState();
  authToken.set(null);
  localStorage.clear();
});
afterAll(() => server.close());

// jsdom gaps used by Radix menus/dialogs.
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.releasePointerCapture ??= () => undefined;
Element.prototype.scrollIntoView ??= () => undefined;
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
