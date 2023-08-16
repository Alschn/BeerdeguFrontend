import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ACCESS_TOKEN_KEY, accessCookieConfig } from "~/config";
import { env } from "~/env.mjs";

interface TokenResponse {
  access: string;
}

const REFRESH_TOKEN_URL = `${env.API_URL}/api/auth/token/refresh/`;

const schema = z.object({
  refresh: z.string(),
});

export async function POST(request: NextRequest) {
  let refresh;

  try {
    const data = (await request.json()) as unknown;
    const parsedBody = schema.safeParse(data);
    if (parsedBody.success) {
      refresh = parsedBody.data.refresh;
    } else {
      return NextResponse.json(parsedBody.error, { status: 400 });
    }
  } catch {
    return NextResponse.json(
      { refresh: "Invalid response body! Expected json with `refresh` key." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      return NextResponse.json(await res.json(), { status: res.status });
    }
    const data = (await res.json()) as TokenResponse;
    const response = NextResponse.json(data, { status: 200 });
    response.cookies.set(ACCESS_TOKEN_KEY, data.access, accessCookieConfig);
    return response;
  } catch (error) {
    return NextResponse.json(
      { refresh: "Failed to refresh access token" },
      { status: 500 }
    );
  }
}
