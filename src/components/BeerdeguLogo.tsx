import { Flex, type FlexProps, Text } from "@mantine/core";
import NextImage, { type ImageProps } from "next/image";
import type { FC } from "react";
import logo from "~/assets/logo.svg";

type BeerdeguLogoProps = Omit<ImageProps, "src" | "alt"> & {
  textHeight?: number;
  showText?: boolean;
  containerProps?: FlexProps;
};

const BeerdeguLogo: FC<BeerdeguLogoProps> = ({
  height = 48,
  textHeight = 32,
  showText = true,
  containerProps,
  ...props
}) => {
  return (
    <Flex
      align="center"
      justify="center"
      columnGap={8}
      sx={{ userSelect: "none" }}
      {...containerProps}
    >
      <NextImage
        src={logo as string}
        alt="Beerdegu"
        height={height}
        {...props}
      />
      {showText && (
        <Text
          size={textHeight}
          fw={700}
          variant="gradient"
          gradient={{ from: "orange", to: "yellow", deg: 45 }}
          component="span"
        >
          Beerdegu
        </Text>
      )}
    </Flex>
  );
};

export default BeerdeguLogo;
