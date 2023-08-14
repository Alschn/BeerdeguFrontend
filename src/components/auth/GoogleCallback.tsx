"use client";

import { Button, Group, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import NextLink from "next/link";
import { type GoogleLoginPayload, googleLogin } from "~/api/auth";

const GoogleCallback = ({ code }: { code: string }) => {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const mounted = useRef<boolean>(false);

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: GoogleLoginPayload) => googleLogin(data),
    onSuccess: () => {
      notifications.show({
        title: "Successfully authenticated",
        message: "Do not leave the page! Redirecting...",
        color: "green",
      });
      router.refresh();
      router.push(next || "/");
    },
    onError: (err) => {
      console.error(err);
      notifications.show({
        title: "Failed to authenticate",
        message: "Please try again later...",
        color: "red",
      });
    },
  });

  // try to authenticate user on component mount
  useEffect(() => {
    if (!mounted.current) {
      mutation.mutate({ code });
      mounted.current = true;
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (mutation.isSuccess || mutation.isLoading) return <Loader />;

  return (
    <Group>
      <NextLink href="/">
        <Button>Back to homepage</Button>
      </NextLink>
      <NextLink href="/auth/login">
        <Button variant="outline">Back to login page</Button>
      </NextLink>
    </Group>
  );
};

export default GoogleCallback;
