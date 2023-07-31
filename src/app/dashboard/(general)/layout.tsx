"use client";

import {
  AppShell,
  Box,
  Burger,
  Divider,
  Flex,
  Group,
  Header,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import ColorModeToggle from "~/components/ColorModeToggle";
import { useAuth } from "~/components/context/auth";
import DashboardNavbar from "~/components/dashboard/Navbar";
import NotificationsToggle from "~/components/dashboard/NotificationsToggle";
import SettingsToggle from "~/components/dashboard/SettingsToggle";
import UserMenu from "~/components/UserMenu";
import DashboardBreadcrumbs from "~/components/dashboard/Breadcrumbs";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);

  const toggleNavbar = () => setIsNavbarOpen((o) => !o);
  const toggleExpandedNavbar = () => setIsNavbarExpanded((o) => !o);

  useEffect(() => {
    // close full screen navbar on route change
    setIsNavbarOpen(false);
  }, [pathname]);

  return (
    <AppShell
      styles={(theme) => ({
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          [theme.fn.smallerThan(theme.breakpoints.sm)]: {
            paddingLeft: "1rem",
          },
          [theme.fn.largerThan(theme.breakpoints.sm)]: {
            paddingTop: "1rem",
          },
          [theme.fn.largerThan(theme.breakpoints.md)]: {
            paddingLeft: isNavbarExpanded ? 300 + 16 : 80 + 16,
          },
        },
      })}
      navbar={
        // Sidebar with navigation links
        <DashboardNavbar
          top={0}
          p="md"
          hiddenBreakpoint="md"
          hidden={!isNavbarOpen}
          isExpanded={isNavbarExpanded}
          toggleExpanded={toggleExpandedNavbar}
          toggleNavbar={toggleNavbar}
        />
      }
      header={
        // Header visible only on mobile devices
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <div className="media-query-component-wrapper">
            <HeaderMobile
              user={user}
              isNavbarOpen={isNavbarOpen}
              toggleNavbar={toggleNavbar}
            />
          </div>
        </MediaQuery>
      }
    >
      {/* Bar with color mode toggle, notifications, settings, user button menu */}
      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <div className="media-query-component-wrapper">
          <HeaderBar
            user={user}
            isNavbarOpen={isNavbarOpen}
            toggleNavbar={toggleNavbar}
          />
        </div>
      </MediaQuery>

      {/* Main content */}
      <Box mt={{ base: 0, md: 20 }}>{children}</Box>
    </AppShell>
  );
};

function HeaderBar({
  user,
  isNavbarOpen,
  toggleNavbar,
}: {
  user: { username: string } | null;
  isNavbarOpen: boolean;
  toggleNavbar: () => void;
}) {
  const theme = useMantineTheme();
  const displayHeaderHamburger = useMediaQuery(
    `(max-width: ${theme.breakpoints.md})`
  );

  return (
    <Flex justify="space-between" align="center">
      <DashboardBreadcrumbs />
      <Group
        sx={{
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          padding: "0.5rem",
        }}
        spacing={16}
      >
        {displayHeaderHamburger && (
          <>
            <Burger
              opened={isNavbarOpen}
              onClick={toggleNavbar}
              size="sm"
              color={theme.colors.gray[6]}
              bg={theme.colorScheme === "dark" ? theme.colors.dark[7] : "white"}
            />
            <Divider orientation="vertical" />
          </>
        )}
        <ColorModeToggle />
        <Divider orientation="vertical" />
        {/* <NotificationsToggle />
        <SettingsToggle /> */}
        <UserMenu
          user={{
            name: user?.username ?? "",
            image: "",
          }}
        />
      </Group>
    </Flex>
  );
}

function HeaderMobile({
  isNavbarOpen,
  toggleNavbar,
  user,
}: {
  isNavbarOpen: boolean;
  toggleNavbar: () => void;
  user: { username: string } | null;
}) {
  const theme = useMantineTheme();

  return (
    <Header height={{ base: 50, sm: 0 }} p="md">
      <Flex align="center" justify="space-between" h="100%">
        <Burger
          opened={isNavbarOpen}
          onClick={toggleNavbar}
          size="sm"
          mr="xl"
          color={theme.colors.gray[6]}
        />
        <Group
          sx={{
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          }}
          spacing={16}
        >
          <ColorModeToggle />
          {/* <NotificationsToggle />
          <SettingsToggle /> */}
          <UserMenu
            user={{
              name: user?.username ?? "",
              image: "",
            }}
          />
        </Group>
      </Flex>
    </Header>
  );
}

export default DashboardLayout;
