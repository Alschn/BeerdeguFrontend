import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "~/env.mjs";

const CONFIRM_EMAIL_PATH = "/api/auth/register/confirm-email/";

export default async function RegisterConfirmPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const key = searchParams?.key as string;
  const access = cookies().get("access");

  // todo: redirect button
  if (!key) return <h1>Invalid link</h1>;

  const r = await fetch(`${env.API_URL}${CONFIRM_EMAIL_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: access?.value ? `Bearer ${access.value}` : "",
    },
    body: JSON.stringify({ key }),
  });

  // todo: prettier error, redirect button, error state
  if (!r.ok) return <h1>Invalid or expired link</h1>;

  redirect("/auth/login");
}
