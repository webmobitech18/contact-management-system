import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAuthed = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (!isAuthed && !isLoginRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthed && isLoginRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
