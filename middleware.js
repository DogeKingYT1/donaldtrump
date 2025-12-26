import { NextResponse } from 'next/server';

export function middleware(req) {
  const auth = req.headers.get('authorization');
  if (!auth) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
    });
  }

  const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [user, pass] = decoded.split(':');

  if (user !== 'dogeking' || pass !== 'showmethelight2025') {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
    });
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin'] };