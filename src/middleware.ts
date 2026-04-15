import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.match(/^\/(_next|favicon\.ico|images|icons)/)) {
    console.log('Middleware executed:', request.nextUrl.pathname);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|icons).*)'],
};