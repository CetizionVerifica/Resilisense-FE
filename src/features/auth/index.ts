// Public surface of the auth feature (M01 §9). Other features import only from here
// (docs/revamp/06-modular-build.md §3); the router (composition root) may import routes directly.
export { MfaSetup } from './components/mfa-setup';
export { MIN_PASSWORD, newPassword } from './schemas';
