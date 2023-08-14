import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./config";

const LOGIN_URL = "/auth/login/";

function AuthRoutesMiddleware(request: NextRequest) {
  const access = request.cookies.get(ACCESS_TOKEN_KEY);

  if (access?.value && request.nextUrl.pathname !== LOGIN_URL) {
    // access token already present - user is already logged in
    // redirect them back to where they came from
    return NextResponse.redirect(
      new URL(`/?next=${request.nextUrl.pathname}`, request.url)
    );
  }
  // no access token - user is not logged in
  return NextResponse.next();
}

function RedirectNextMiddleware(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") as string;
  return NextResponse.redirect(new URL(next, request.url));
}

async function RefreshTokenMiddleware(request: NextRequest) {
  try {
    // try to refresh access token
    const res = await fetch(`/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    // refresh token was missing / invalid
    if (!res.ok) {
      return NextResponse.redirect(new URL(LOGIN_URL, request.url));
    }
    // successfully refreshed token (cookies were set by api route)
    return NextResponse.next();
  } catch (error) {
    // network or parsing error
    return NextResponse.redirect(new URL(LOGIN_URL, request.url));
  }
}

function ProtectedRoutesMiddleware(request: NextRequest) {
  const access = request.cookies.get(ACCESS_TOKEN_KEY);
  if (!access?.value) {
    // access token is missing on protected routes
    return NextResponse.redirect(
      new URL(`${LOGIN_URL}?next=${request.nextUrl.pathname}`, request.url)
    );
  }
  return NextResponse.next();
}

// https://nextjs.org/docs/app/building-your-application/routing/middleware

export async function middleware(request: NextRequest) {
  // todo: handle loops, some not trivial edge cases
  // maybe compose middlewares - make them sequential

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return AuthRoutesMiddleware(request);
  }

  if (request.nextUrl.searchParams.has("next")) {
    return RedirectNextMiddleware(request);
  }

  const refresh = request.cookies.get(REFRESH_TOKEN_KEY);
  const access = request.cookies.get(ACCESS_TOKEN_KEY);

  // anywhere else - has refresh token but no access token
  if (refresh?.value && !access?.value) {
    return await RefreshTokenMiddleware(request);
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return ProtectedRoutesMiddleware(request);
  }

  // we are not on protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
