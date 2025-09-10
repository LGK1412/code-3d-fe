import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname } = req.nextUrl;

  // Nếu đã có token thì chặn vào /login và /register
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Chặn /admin và /profile nếu chưa login
  if (pathname.startsWith('/admin') || pathname.startsWith('/profile') || pathname.startsWith('/cart')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/admin')) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
        );

        if (payload.role !== 'admin') {
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch (err) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register', '/profile', '/cart'],
};
