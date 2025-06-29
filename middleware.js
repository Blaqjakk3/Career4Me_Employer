import { NextResponse } from "next/server";

export async function middleware(request) {
    const isAuthenticated = true;
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();}

    export const config = {
        matcher: ['/dashboard'],
    };