import { NextResponse } from 'next/server';
import { getAccessToken } from './app/lib/actions';

export async function middleware(request: { nextUrl: { pathname: string; }; url: string | URL | undefined; }) {
  const accessToken = await getAccessToken();

  // Define paths that require authentication
  const protectedPaths = [
    '/review', // Example: Add your protected routes here
    '/placeorder',
    '/Delivery',
    '/userprofile',
     // Example: Protect server-side API routes
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If the path is protected and no valid access token exists
  if (isProtectedPath && !accessToken) {
    // Redirect to home page (or another page where the modal can be triggered)
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('login', 'true'); // Optional: Signal to open the modal
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed if authenticated or if the path isn’t protected
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico).*)', // Apply to all routes except Next.js internals and favicon
  ],
};