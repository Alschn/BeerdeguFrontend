import {
  Avatar,
  createStyles,
  Group,
  Menu,
  type MenuProps,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconDashboard,
  IconHome,
  IconLogout,
  IconSettings,
  IconHeart,
  IconMessage,
  IconStar,
} from "@tabler/icons-react";
import { type FC } from "react";
import NextLink from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { logout } from "~/api/auth";

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
    [theme.fn.smallerThan("xs")]: {
      display: "none",
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
  user: {
    name: string;
    image: string;
  };
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
  const [userMenuOpened, { close: closeUserMenu, open: openUserMenu }] =
    useDisclosure();
  const { classes, cx, theme } = useStyles({ isOpen: userMenuOpened });
  const mutation = useLogoutMutation();

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={closeUserMenu}
      onOpen={openUserMenu}
      withinPortal
      {...rest}
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group spacing={7}>
            <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
              {user.name}
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

        <NextLink href="/">
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

        <Menu.Label>Settings</Menu.Label>

        <NextLink href="/dashboard/account">
          <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
            Account settings
          </Menu.Item>
        </NextLink>

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
