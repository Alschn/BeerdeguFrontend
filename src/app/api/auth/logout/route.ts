import { type NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "~/config";
import { env } from "~/env.mjs";

const LOGOUT_URL = `${env.API_URL}/api/auth/logout/`;

export async function POST(request: NextRequest) {
  const access = request.cookies.get(ACCESS_TOKEN_KEY);
  const refresh = request.cookies.get(REFRESH_TOKEN_KEY);
  if (!refresh) return getNextResponse();
  try {
    await fetch(LOGOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: access?.value ? `Bearer ${access.value}` : "",
      },
      body: JSON.stringify({ refresh: refresh.value }),
    });
  } finally {
    return getNextResponse();
  }
}

function getNextResponse() {
  const response = NextResponse.json({});
  response.cookies.set(ACCESS_TOKEN_KEY, "", { maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_KEY, "", { maxAge: 0 });
  return response;
}
