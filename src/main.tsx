import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { AppProviders } from './app/providers';
import { createRouter } from './app/router';
import { initI18n } from './lib/i18n';
import './styles/index.css';

async function enableMocks(): Promise<void> {
  if (import.meta.env.VITE_API_MOCKS !== '1') return;
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true });
}

async function main(): Promise<void> {
  await enableMocks();
  await initI18n();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={createRouter()} />
      </AppProviders>
    </StrictMode>,
  );
}

void main();
