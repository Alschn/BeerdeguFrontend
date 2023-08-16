import {
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  createStyles,
  type MenuProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconChevronDown,
  IconDashboard,
  // IconSettings,
  // IconHeart,
  // IconMessage,
  // IconStar,
  IconDeviceDesktopAnalytics,
  IconHome,
  IconLogout,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { logout } from "~/api/auth";
import type { User } from "~/api/types";

const useStyles = createStyles((theme, { isOpen }: { isOpen: boolean }) => ({
  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },
  },
  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
  icon: {
    transition: "transform 150ms ease",
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
  },
}));

interface UserMenuProps extends MenuProps {
  user: User;
}

const useLogoutMutation = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      notifications.show({
        title: "Logout successful",
        message: "Redirecting to login page...",
      });
      router.push("/auth/login");
      router.refresh();
    },
    onError: () => {
      notifications.show({
        title: "Logout failed",
        message: "Please try again later...",
      });
    },
  });
  return mutation;
};

const UserMenu: FC<UserMenuProps> = ({ user, ...rest }) => {
  const [isMenuOpen, { close: closeMenu, open: openMenu }] = useDisclosure();
  const { classes, cx, theme } = useStyles({ isOpen: isMenuOpen });

  const mutation = useLogoutMutation();

  const handleLogout = () => mutation.mutate();

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={closeMenu}
      onOpen={openMenu}
      withinPortal
      {...rest}
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: isMenuOpen })}
        >
          <Group spacing={7}>
            <Avatar
              // todo: change when image is available
              src={undefined}
              alt={user.username}
              radius="xl"
              size={"1.5rem"}
              color="cyan"
            >
              {user.username.at(0) ?? null}
            </Avatar>
            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
              {user.username}
            </Text>
            <IconChevronDown
              size="1rem"
              className={classes.icon}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {/* <Menu.Item
          icon={
            <IconHeart size="0.9rem" color={theme.colors.red[6]} stroke={1.5} />
          }
        >
          Liked posts
        </Menu.Item>
        <Menu.Item
          icon={
            <IconStar
              size="0.9rem"
              color={theme.colors.yellow[6]}
              stroke={1.5}
            />
          }
        >
          Saved posts
        </Menu.Item>
        <Menu.Item
          icon={
            <IconMessage
              size="0.9rem"
              color={theme.colors.blue[6]}
              stroke={1.5}
            />
          }
        >
          Your comments
        </Menu.Item> */}

        <Menu.Label>Home</Menu.Label>

        <NextLink href="/">
          <Menu.Item
            icon={
              <IconHome
                size="0.9rem"
                stroke={1.5}
                color={theme.colors.orange[6]}
              />
            }
          >
            Homepage
          </Menu.Item>
        </NextLink>

        <Menu.Label>Dashboard</Menu.Label>

        <NextLink href="/dashboard">
          <Menu.Item
            icon={
              <IconDashboard
                size="0.9rem"
                stroke={1.5}
                color={theme.colors.blue[6]}
              />
            }
          >
            Dashboard
          </Menu.Item>
        </NextLink>
        <NextLink href="/dashboard/rooms">
          <Menu.Item
            icon={
              <IconDeviceDesktopAnalytics
                size="0.9rem"
                stroke={1.5}
                color={theme.colors.blue[6]}
              />
            }
          >
            Rooms
          </Menu.Item>
        </NextLink>

        {/* <Menu.Label>Settings</Menu.Label>

        <NextLink href="/dashboard/account">
          <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
            Account settings
          </Menu.Item>
        </NextLink> */}

        <Menu.Divider />

        <Menu.Item
          color="red"
          icon={<IconLogout size="0.9rem" stroke={1.5} />}
          onClick={handleLogout}
          disabled={mutation.isLoading}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
