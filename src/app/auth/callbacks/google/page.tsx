import GoogleCallback from "~/components/auth/GoogleCallback";

export default async function GoogleCallbackPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const code = searchParams?.code as string | undefined;
  if (!code) return <h1>Invalid query parameters...</h1>;
  return <GoogleCallback code={code} />;
}
