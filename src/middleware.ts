import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (!token && !isAuthPage) {
    if (request.nextUrl.pathname.startsWith('/dashboards')) {
       return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboards/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboards/:path*', '/auth/:path*'],
};
