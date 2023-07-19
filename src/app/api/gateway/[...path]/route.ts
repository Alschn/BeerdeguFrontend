import { cookies } from "next/dist/client/components/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env.mjs";

/*
 * This is a proxy route that forwards requests to the API server.
 */
async function handler(req: NextRequest): Promise<NextResponse<unknown>> {
  if (!req.nextUrl.pathname.startsWith("/api/gateway")) {
    return NextResponse.json({ error: "Invalid proxy url" }, { status: 404 });
  }

  const method = req.method;
  // todo: extra options passed via headers e.g. caching options
  // const headers = req.headers;

  const pathname = req.nextUrl.pathname;
  let path = pathname.replace("/api/gateway", "");
  path = path.replace(/\/?(\?|#|$)/, "/$1"); // append trailing slash
  const params = req.nextUrl.searchParams;
  const url = new URL(path, env.API_URL);
  url.search = params.toString();

  const access = cookies().get("access");

  let optionalBody = undefined;
  try {
    optionalBody = JSON.stringify(await req.json());
  } catch (e) {
    // empty body in request
  }

  let r;
  try {
    r = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: access ? `Bearer ${access.value}` : "",
      },
      body: optionalBody,
    });
  } catch (e) {
    // network error
    console.error(e);
    return NextResponse.json({ error: "Network" }, { status: 500 });
  }

  try {
    let data;
    const contentType = r.headers.get("Content-Type");
    const resMeta = { status: r.status, headers: r.headers };
    if (contentType === "application/json") {
      data = (await r.json()) as unknown;
      return NextResponse.json(data, resMeta);
    }
    if (contentType === "text/plain") {
      // text data - should not really happen
      data = await r.text();
    } else {
      // binary data e.g file responses
      data = await r.blob();
    }
    return new NextResponse(data, resMeta);
  } catch (e) {
    // parsing error
    console.error(e);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        requestStatus: r.status,
        requestStatusText: r.statusText,
      },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
