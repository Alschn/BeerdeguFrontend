import GoogleCallback from "~/components/auth/GoogleCallback";

export default function GoogleCallbackPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const code = searchParams?.code as string | undefined;
  if (!code) return <h1>Invalid query parameters...</h1>;
  return <GoogleCallback code={code} />;
}
