import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const token = request.cookies.get("careernext_session")?.value;

  if (isDashboard && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
