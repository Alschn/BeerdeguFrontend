import { ActionIcon, type ActionIconProps } from "@mantine/core";
import { IconSettings, type TablerIconsProps } from "@tabler/icons-react";
import { type FC } from "react";

interface SettingsToggleProps extends ActionIconProps {
  iconProps?: TablerIconsProps;
}

const SettingsToggle: FC<SettingsToggleProps> = (
  {
    iconProps,
    ...rest
  }
) => {
  // todo

  return (
    <ActionIcon
      size={40}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ?
          theme.colors.dark[6] :
          theme.colors.gray[0],
        "&:hover": {
          backgroundColor: theme.colorScheme === 'dark' ?
            theme.colors.dark[7] :
            'white',
        }
      })}
      {...rest}
    >
      <IconSettings {...iconProps}/>
    </ActionIcon>
  );
};

export default SettingsToggle;
