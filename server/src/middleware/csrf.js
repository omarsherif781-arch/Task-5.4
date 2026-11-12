import { doubleCsrf } from 'csrf-csrf';

const csrf = doubleCsrf({
  getSecret: () => {
    if (!process.env.CSRF_SECRET) throw new Error('CSRF_SECRET environment variable is required');
    return process.env.CSRF_SECRET;
  },
  getSessionIdentifier: (req) => req.cookies?.token || '',
  cookieName: 'csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token']
});

export const { doubleCsrfProtection, generateCsrfToken } = csrf;
