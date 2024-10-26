import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ACCESS_TOKEN_KEY } from "~/config";

interface DashboardProtectedLayoutProps {
  children: ReactNode;
}

export default async function DashboardProtectedLayout(
  {
    children,
  }: DashboardProtectedLayoutProps
) {
  const access = (await cookies()).get(ACCESS_TOKEN_KEY);
  if (!access) return redirect("/auth/login/?next=/dashboard");
  return children;
}
