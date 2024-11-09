import { NextRequest, NextResponse } from 'next/server'
import { match } from 'path-to-regexp'

function matchPathname(pattern: string, pathname: string) {
  const isMatch = match(pattern)
  return isMatch(pathname).valueOf()
}

const privatePatterns = ['/manage{/*path}']
const authPatterns = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = !!request.cookies.get('accessToken')?.value

  if (
    privatePatterns.some((pattern) => matchPathname(pattern, pathname)) &&
    !isAuth
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (
    authPatterns.some((pattern) => matchPathname(pattern, pathname)) &&
    isAuth
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login']
}
