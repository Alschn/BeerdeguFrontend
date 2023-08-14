import { type NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "~/config";
import { env } from "~/env.mjs";

interface TokenResponse {
  access: string;
}

const REFRESH_TOKEN_URL = `${env.API_URL}/api/auth/token/refresh/`;

export async function POST(request: NextRequest) {
  const refresh = request.cookies.get(REFRESH_TOKEN_KEY);
  if (!refresh?.value) {
    return NextResponse.json(
      { refresh: "Missing refresh cookie" },
      { status: 401 }
    );
  }
  try {
    const res = await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refresh.value }),
    });
    if (!res.ok) {
      return NextResponse.json(await res.json(), { status: res.status });
    }
    const data = (await res.json()) as TokenResponse;
    const response = NextResponse.json({}, { status: 200 });
    response.cookies.set(ACCESS_TOKEN_KEY, data.access);
    return response;
  } catch (error) {
    return NextResponse.json(
      { refresh: "Failed to refresh access token" },
      { status: 500 }
    );
  }
}
