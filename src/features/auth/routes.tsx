import { type RouteObject } from 'react-router';
import { AuthLayout } from './components/auth-layout';

const page = (load: () => Promise<{ Component: React.ComponentType }>) => ({ lazy: load });

/** Sign-in, sign-up and forgot-password redirect signed-in users home (PublicOnly). */
export const publicOnlyAuthRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', ...page(async () => ({ Component: (await import('./pages/sign-in-page')).SignInPage })) },
      { path: 'sign-up', ...page(async () => ({ Component: (await import('./pages/sign-up-page')).SignUpPage })) },
      {
        path: 'forgot-password',
        ...page(async () => ({ Component: (await import('./pages/forgot-password-page')).ForgotPasswordPage })),
      },
    ],
  },
];

/** Token links from emails work whether or not someone is signed in. */
export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'reset-password/:token',
        ...page(async () => ({ Component: (await import('./pages/reset-password-page')).ResetPasswordPage })),
      },
      {
        path: 'accept-invite/:token',
        ...page(async () => ({ Component: (await import('./pages/accept-invite-page')).AcceptInvitePage })),
      },
      {
        path: 'verify-email/:token',
        ...page(async () => ({ Component: (await import('./pages/verify-email-page')).VerifyEmailPage })),
      },
    ],
  },
];
