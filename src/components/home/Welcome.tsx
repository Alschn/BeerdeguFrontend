"use client";

import { Title, Text, createStyles, Box, Group, Button } from "@mantine/core";
import { useAuth } from "../context/auth";
import NextLink from "next/link";
import { logout } from "~/api/auth";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontSize: 100,
    fontWeight: 900,
    letterSpacing: -2,
    [theme.fn.smallerThan("md")]: {
      fontSize: 50,
    },
  },
}));

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

function Welcome() {
  const { classes } = useStyles();
  const { isAuthenticated } = useAuth();

  const logoutMutation = useLogoutMutation();
  const handleLogout = () => logoutMutation.mutate();

  return (
    <Box
      mt={60}
      h="calc(100vh - 60px)"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title className={classes.title} align="center" mt={0}>
        Welcome to{" "}
        <Text
          inherit
          variant="gradient"
          gradient={{ from: "orange", to: "yellow", deg: 45 }}
          component="span"
        >
          Beerdegu
        </Text>
      </Title>
      <Text
        color="dimmed"
        align="center"
        size="lg"
        sx={{ maxWidth: 580 }}
        mx="auto"
        px="sm"
        my="lg"
      >
        Secure your spot for the ultimate online, real time craft beer tasting
        experience, and get ready to embark on a flavor-filled adventure!
        Possible thanks to the power of Beerdegu!
      </Text>
      <Group mt="sm">
        {!isAuthenticated ? (
          <>
            <NextLink href="/auth/login">
              <Button color="orange" miw={{ xs: 120, sm: 150 }}>
                Login
              </Button>
            </NextLink>
            <NextLink href="/auth/register">
              <Button color="yellow" miw={{ xs: 120, sm: 150 }}>
                Register
              </Button>
            </NextLink>
          </>
        ) : (
          <>
            <NextLink href="/dashboard/rooms/join">
              <Button color="orange" miw={{ xs: 90, sm: 150 }}>
                Join Room
              </Button>
            </NextLink>
            <NextLink href="/dashboard/rooms/create">
              <Button color="yellow" miw={{ xs: 90, sm: 150 }}>
                Create Room
              </Button>
            </NextLink>
            <Button
              color="red"
              disabled={logoutMutation.isLoading}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        )}
      </Group>
    </Box>
  );
}

export default Welcome;
