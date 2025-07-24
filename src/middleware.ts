import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes require admin access
const isAdminRoute = createRouteMatcher(['/admin/(.+)'])

// Define the admin login page that doesn't require authentication
const isAdminLoginRoute = createRouteMatcher(['/admin'])

export default clerkMiddleware(async (auth, req) => {
  // Check if this is an admin route
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth()
    
    // If user is not authenticated, redirect to admin login page
    if (!userId) {
      if (!isAdminLoginRoute(req)) {
        const adminUrl = new URL('/admin', req.url)
        return NextResponse.redirect(adminUrl)
      }
      return NextResponse.next()
    }
    
    // If user is authenticated, check if they have admin privileges via sessionClaims
    if (sessionClaims?.role !== 'admin') {
      // User is authenticated but not an admin - redirect to home
      const homeUrl = new URL('/', req.url)
      return NextResponse.redirect(homeUrl)
    }
    
    // If user is authenticated admin trying to access login page, redirect to analytics
    if (isAdminLoginRoute(req)) {
      const analyticsUrl = new URL('/admin/analytics', req.url)
      return NextResponse.redirect(analyticsUrl)
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}