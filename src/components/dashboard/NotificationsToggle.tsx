import { ActionIcon, type ActionIconProps } from "@mantine/core";
import { IconBell, type TablerIconsProps } from "@tabler/icons-react";
import { type FC } from "react";

interface NotificationsToggleProps extends ActionIconProps {
  iconProps?: TablerIconsProps;
}

const NotificationsToggle: FC<NotificationsToggleProps> = (
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
      <IconBell {...iconProps}/>
    </ActionIcon>
  );
};

export default NotificationsToggle;
