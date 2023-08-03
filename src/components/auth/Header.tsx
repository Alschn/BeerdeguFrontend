"use client";

import { Group, Header, type HeaderProps } from "@mantine/core";
import BeerdeguLogo from "../BeerdeguLogo";
import NextLink from "next/link";

const AuthHeader = (props: Omit<HeaderProps, "children">) => {
  return (
    <Header
      px="md"
      py={8}
      pos="fixed"
      bg="transparent"
      zIndex={1}
      withBorder={false}
      {...props}
    >
      <Group position="center" align="center" h="100%">
        <NextLink href="/">
          <BeerdeguLogo showText />
        </NextLink>
      </Group>
    </Header>
  );
};

export default AuthHeader;
