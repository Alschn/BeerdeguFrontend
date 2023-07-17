import PasswordResetConfirm from "~/components/auth/PasswordResetConfirm";
import PasswordResetConfirmInvalid from "~/components/auth/PasswordResetConfirmInvalid";

export default function PasswordResetConfirmPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams?.token || !searchParams?.uid) {
    return <PasswordResetConfirmInvalid />;
  }

  // todo: additional validation
  const uid = searchParams.uid as string;
  const token = searchParams.token as string;

  return <PasswordResetConfirm uid={uid} token={token} />;
}
