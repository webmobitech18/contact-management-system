import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from './constants';

export const isAuthenticated = () => {
  // Any non-empty cookie value means logged in for this lightweight auth flow.
  return Boolean(cookies().get(AUTH_COOKIE_NAME)?.value);
};
