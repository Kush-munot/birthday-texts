import { NextResponse } from 'next/server';

export function middleware(request) {
    const cookie = request.cookies.get('user');
    const { pathname } = request.nextUrl;

    // Check if the request is for the root '/' and the user cookie is present
    if (pathname === '/' && cookie && cookie.value.length >= 9) {
        const url = request.nextUrl.clone();
        url.pathname = '/birthdays';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/',
};