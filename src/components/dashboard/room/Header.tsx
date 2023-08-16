import {
  ActionIcon,
  Avatar,
  Burger,
  Divider,
  Group,
  Header,
  Text,
  Tooltip,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import ColorModeToggle from "~/components/ColorModeToggle";
import UserMenu from "~/components/UserMenu";
import { useAuth } from "~/components/context/auth";
import { useRoom } from "~/components/context/room";

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  inner: {
    height: rem(60),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

interface RoomHeaderProps {
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
}

const DISPLAY_AVATARS_COUNT = 3;

const RoomHeader = ({ onDrawerToggle, isDrawerOpen }: RoomHeaderProps) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { user } = useAuth();
  const { roomName, users } = useRoom();

  const totalUsers = users.length;
  const shownUsers = users.slice(0, DISPLAY_AVATARS_COUNT);
  const hiddenUsers = users.slice(DISPLAY_AVATARS_COUNT);

  return (
    <Header height={60} className={classes.header}>
      <div className={classes.inner}>
        <Group align="center">
          <ActionIcon radius="sm" color={theme.colors.gray[6]}>
            <Burger
              opened={isDrawerOpen}
              onClick={onDrawerToggle}
              aria-label={"Toggle drawer"}
              size="sm"
            />
          </ActionIcon>

          <Text
            size="lg"
            weight={600}
            color={theme.colorScheme === "dark" ? "white" : "blue"}
          >
            Room {roomName}
          </Text>
        </Group>

        <Group spacing="sm">
          <Avatar.Group>
            {shownUsers.map((user) => (
              <Tooltip label={user.username} key={user.username} withArrow>
                <Avatar radius="xl" variant="light" color="blue">
                  {user.username.substring(0, 2)}
                </Avatar>
              </Tooltip>
            ))}
            {totalUsers > DISPLAY_AVATARS_COUNT && (
              <Tooltip
                label={
                  <>
                    {hiddenUsers.map((user) => (
                      <div key={`hidden-${user.username}`}>{user.username}</div>
                    ))}
                  </>
                }
                withArrow
              >
                <Avatar radius="xl">
                  +{totalUsers - DISPLAY_AVATARS_COUNT}
                </Avatar>
              </Tooltip>
            )}
          </Avatar.Group>

          <Divider orientation="vertical" />

          <ColorModeToggle />

          {!!user && <UserMenu user={user} />}
        </Group>
      </div>
    </Header>
  );
};

export default RoomHeader;
