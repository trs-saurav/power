import { auth } from "next-auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  
  // If accessing /admin route, check if user has admin role
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // No session = not authenticated
    if (!session) {
      const signInUrl = new URL("/sign-in", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Has session but not admin role
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }
  
  // Allow request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};