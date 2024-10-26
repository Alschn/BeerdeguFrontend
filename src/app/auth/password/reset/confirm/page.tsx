import PasswordResetConfirm from "~/components/auth/PasswordResetConfirm";
import PasswordResetConfirmInvalid from "~/components/auth/PasswordResetConfirmInvalid";

export default async function PasswordResetConfirmPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  if (!searchParams?.token || !searchParams?.uid) {
    return <PasswordResetConfirmInvalid />;
  }

  // todo: additional validation
  const uid = searchParams.uid as string;
  const token = searchParams.token as string;

  return <PasswordResetConfirm uid={uid} token={token} />;
}
