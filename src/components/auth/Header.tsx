"use client";

import { Group, Header, type HeaderProps } from "@mantine/core";

const AuthHeader = (props: Omit<HeaderProps, "children">) => {
  return (
    <Header
      px="md"
      withBorder={false}
      pos="fixed"
      zIndex={1}
      bg="transparent"
      {...props}
    >
      <Group position="apart" align="center" h="100%">
        {/* todo */}
      </Group>
    </Header>
  );
};

export default AuthHeader;
