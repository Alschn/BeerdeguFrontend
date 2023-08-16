import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./config";

const LOGIN_URL = "/auth/login/";

function AuthRoutesMiddleware(request: NextRequest) {
  const access = request.cookies.get(ACCESS_TOKEN_KEY);

  if (access?.value && !request.nextUrl.pathname.startsWith("/auth/login")) {
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
  console.debug("Refreshing token...");
  const refresh = request.cookies.get(REFRESH_TOKEN_KEY);
  const refreshUrl = new URL(`/api/auth/refresh/`, request.url);

  try {
    // try to refresh access token
    const res = await fetch(refreshUrl, {
      method: "POST",
      body: JSON.stringify({ refresh: refresh?.value }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    // refresh token was missing / invalid
    if (!res.ok) {
      const json = (await res.json()) as unknown;
      console.debug("Refresh token is invalid or expired", {
        status: res.status,
        json: json,
      });
      const response = NextResponse.redirect(new URL(LOGIN_URL, request.url));
      // clear refresh token cookie
      response.cookies.set(REFRESH_TOKEN_KEY, "", { maxAge: 0 });
      return response;
    }
    console.debug("Access token successfully refreshed");
    const data = (await res.json()) as { access: string };
    const response = NextResponse.next();
    response.cookies.set(ACCESS_TOKEN_KEY, data.access);
    // successfully refreshed token (cookies were set by api route)
    return response;
  } catch (error) {
    console.debug("Error refreshing token", error);
    // network or parsing error
    return NextResponse.next();
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

  const refresh = request.cookies.get(REFRESH_TOKEN_KEY);
  const access = request.cookies.get(ACCESS_TOKEN_KEY);

  if (refresh?.value && !access?.value) {
    return await RefreshTokenMiddleware(request);
  }

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return AuthRoutesMiddleware(request);
  }

  if (request.nextUrl.searchParams.has("next")) {
    return RedirectNextMiddleware(request);
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
