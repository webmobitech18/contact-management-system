import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, LOGIN_PASSWORD, LOGIN_USERNAME } from '@/lib/constants';

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };

  if (body.username !== LOGIN_USERNAME || body.password !== LOGIN_PASSWORD) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  });

  return response;
}
