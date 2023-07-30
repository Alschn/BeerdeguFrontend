"use client";

import { Container } from "@mantine/core";
import type { ReactNode } from "react";
import AuthHeader from "~/components/auth/Header";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <AuthHeader height={60} />
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {children}
      </Container>
    </>
  );
}
