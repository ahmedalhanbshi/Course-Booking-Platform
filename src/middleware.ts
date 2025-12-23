import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const userCookie = request.cookies.get('course_platform_user')
  
  // Public paths that don't need protection
  if (path.startsWith('/auth') || path === '/' || path.startsWith('/courses')) {
    return NextResponse.next()
  }

  // If no user is logged in, redirect to login
  if (!userCookie) {
    if (path.startsWith('/student') || path.startsWith('/trainer') || path.startsWith('/admin') || path.startsWith('/institute')) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  try {
    const user = JSON.parse(userCookie.value)
    const role = user.role

    // Role-based protection rules
    if (path.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (path.startsWith('/trainer') && role !== 'trainer') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (path.startsWith('/admin') && role !== 'platform_admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (path.startsWith('/institute') && role !== 'institute_admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

  } catch (error) {
    // If cookie is invalid, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/student/:path*',
    '/trainer/:path*',
    '/admin/:path*',
    '/institute/:path*',
  ],
}
