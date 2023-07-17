import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env.mjs";
import { z } from "zod";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  accessCookieConfig,
  refreshCookieConfig,
} from "~/config";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

interface TokenResponse {
  access: string;
  refresh: string;
}

function setJWTCookies(response: NextResponse, data: TokenResponse) {
  response.cookies.set(ACCESS_TOKEN_KEY, data.access, accessCookieConfig);
  response.cookies.set(REFRESH_TOKEN_KEY, data.refresh, refreshCookieConfig);
}

const AUTH_TOKEN_URL = `${env.API_URL}/api/auth/token/`;

export async function POST(request: NextRequest) {
  const parsedBody = schema.safeParse(await request.json());

  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error, { status: 400 });
  }
  try {
    const res = await fetch(AUTH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBody.data),
    });
    if (!res.ok) {
      return NextResponse.json(await res.json(), { status: res.status });
    }
    const data = (await res.json()) as TokenResponse;
    const response = NextResponse.json({}, { status: 200 });
    setJWTCookies(response, data);
    return response;
  } catch (error) {
    return NextResponse.json(
      { refresh: "Failed to refresh access token" },
      { status: 500 }
    );
  }
}
