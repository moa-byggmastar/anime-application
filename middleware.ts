import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    const isLoginPage = req.nextUrl.pathname === '/login'
    const isRootPage = req.nextUrl.pathname === '/'

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/anime/:path*', '/login']
}
