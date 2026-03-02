import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/booking"];
const authPaths = ["/auth/login", "/auth/signup"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;

    // If accessing a protected route without a token, redirect to login
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
    if (isProtected && !token) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If already logged in and trying to access auth pages, redirect to home
    if (authPaths.some((path) => pathname.startsWith(path)) && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/booking/:path*", "/auth/:path*"],
};
