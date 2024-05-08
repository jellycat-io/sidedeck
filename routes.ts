/**
 * An array of routes that are public and do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ['/', '/auth/email-verification'];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to `/settings`.
 * @type {string[]}
 */
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/forgot-password',
  '/auth/reset-password',
];

/**
 * The prefix for api authentication routes.
 * Routes that starts with this prefix are used for API authentication process.
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * A map of routes used in the application.
 */
export const Routes = {
  landing: '/',
  platform: {
    dashboard: '/dashboard',
    library: '/library',
    deck: {
      list: '/deck/list',
      create: '/deck/build',
      view: (id: string) => `/deck/${id}/view`,
      edit: (id: string) => `/deck/${id}/build`,
    },
  },
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    error: '/auth/error',
    forgotPassword: '/auth/forgot-password',
    emailVerification: '/auth/email-verification',
    resetPassword: '/auth/reset-password',
  },
};

/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = Routes.platform.dashboard;
