import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { authToken } from '@/lib/auth-token';
import { initI18n } from '@/lib/i18n';
import { resetMockState } from '@/mocks/handlers';
import { drainContractViolations, recordContract } from './contract';
import { server } from './server';

beforeAll(async () => {
  server.listen({ onUnhandledFrame: 'error' });
  recordContract();
  await initI18n('en');
});
afterEach(async () => {
  cleanup();
  // Mocks must behave like CSR_BE: a response or request outside api/openapi.json fails the test.
  const violations = await drainContractViolations();
  server.resetHandlers();
  resetMockState();
  authToken.set(null);
  localStorage.clear();
  if (violations.length)
    throw new Error(
      `Mocked API traffic that breaks api/openapi.json:\n${violations.map((v) => `  ${v.request}: ${v.problem}`).join('\n')}`,
    );
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
