"use client";

import {
  ActionIcon,
  type ActionIconProps,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconMoonStars,
  IconSun,
  type TablerIconsProps,
} from "@tabler/icons-react";
import { type FC } from "react";

interface ColorModeToggleProps extends ActionIconProps {
  iconProps?: TablerIconsProps;
}

const ColorModeToggle: FC<ColorModeToggleProps> = ({ iconProps, ...rest }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const iconsProps = {
    // size: 20,
    // strokeWidth: 1.5,
    ...iconProps,
  };

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      size={40}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[1],
        color:
          theme.colorScheme === "dark"
            ? theme.colors.yellow[4]
            : theme.colors.blue[6],
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
        },
      })}
      {...rest}
    >
      {colorScheme === "dark" ? (
        <IconSun {...iconsProps} />
      ) : (
        <IconMoonStars {...iconsProps} />
      )}
    </ActionIcon>
  );
};

export default ColorModeToggle;
