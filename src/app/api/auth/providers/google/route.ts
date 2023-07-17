import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env.mjs";
import { z } from "zod";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  accessCookieConfig,
  refreshCookieConfig,
} from "~/config";

interface GoogleLoginResponse {
  access: string;
  refresh: string;
  user: {
    pk: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

const schema = z.object({
  code: z.string(),
});

const GOOGLE_AUTH_TOKEN_URL = `${env.API_URL}/api/auth/providers/google/`;

export async function POST(request: NextRequest) {
  let parsedBody;
  try {
    parsedBody = schema.safeParse(await request.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error, { status: 400 });
  }
  try {
    const res = await fetch(GOOGLE_AUTH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBody.data),
    });
    if (!res.ok) {
      const error = (await res.json()) as unknown;
      console.log(error);
      return NextResponse.json(error, { status: res.status });
    }
    const response = NextResponse.json({}, { status: 200 });
    if (res.status === 200) {
      // access token was returned
      const data = (await res.json()) as GoogleLoginResponse;
      response.cookies.set(ACCESS_TOKEN_KEY, data.access, accessCookieConfig);
      response.cookies.set(
        REFRESH_TOKEN_KEY,
        data.refresh,
        refreshCookieConfig
      );
    }
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
