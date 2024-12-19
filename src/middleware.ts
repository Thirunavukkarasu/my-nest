import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/signin')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(new URL(`/signin?from=${encodeURIComponent(from)}`, req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // This function is called for every request
        // Return true if the request should be allowed, false otherwise
        if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'admin') {
          return false
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard', '/payments', '/flats', '/tenants', '/owners', '/expenses'],
}
