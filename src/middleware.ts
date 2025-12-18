// src/middleware.ts
/**
 * Next.js Middleware for authentication and route protection
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update Supabase session
  const response = await updateSession(request);

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/onboarding'];
  const authPaths = ['/auth/login', '/auth/signup'];

  const path = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p));
  const isAuthPath = authPaths.some(p => path.startsWith(p));

  // Check if user is authenticated by looking at the cookies
  const hasSession = request.cookies.has('sb-access-token') ||
                     request.cookies.has('sb-nqfwozwwbtakrosjjoay-auth-token');

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !hasSession) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if (isAuthPath && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
