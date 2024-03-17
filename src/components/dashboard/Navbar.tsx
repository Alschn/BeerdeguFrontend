import {
  ActionIcon,
  createStyles,
  Divider,
  Flex,
  MediaQuery,
  Navbar,
  type NavbarProps,
  Stack,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconArrowRight,
  IconDatabaseSearch,
  IconDeviceDesktopAnalytics,
  IconGauge,
  // IconSettings,
  IconShoppingCart,
  IconBeer,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import NextLink from "next/link";
import BeerdeguLogo from "~/components/BeerdeguLogo";
import { LinksGroup } from "./LinksGroup";
import type { FC } from "react";

const links = [
  { icon: IconGauge, label: "Dashboard", link: "/dashboard" },
  { icon: IconShoppingCart, label: "Your Purchases", link: "/dashboard/purchases" },
  { icon: IconBeer, label: "Your Ratings", link: "/dashboard/ratings" },
  {
    icon: IconDeviceDesktopAnalytics,
    label: "Rooms",
    links: [
      { label: "All Rooms", link: "/dashboard/rooms" },
      { label: "Join Room", link: "/dashboard/rooms/join" },
      { label: "Create Room", link: "/dashboard/rooms/create" },
    ],
    initiallyOpened: true,
  },
  {
    icon: IconDatabaseSearch,
    label: "Browser",
    links: [
      { label: "Beers", link: "/dashboard/browser/beers" },
      { label: "Beer Styles", link: "/dashboard/browser/styles" },
      { label: "Hops", link: "/dashboard/browser/hops" },
      { label: "Breweries", link: "/dashboard/browser/breweries" },
    ],
    initiallyOpened: true,
  },
  { icon: IconUser, label: "Account", link: "/dashboard/account" },
  // { icon: IconSettings, label: "Settings", link: "/dashboard/settings" },
];

const useStyles = createStyles((theme) => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  expandIcon: {
    ...theme.fn.focusStyles(),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
  },
  linksSection: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },
}));

interface NavbarMinimalProps extends Omit<NavbarProps, "children"> {
  isExpanded: boolean;
  toggleExpanded(): void;
  toggleNavbar(): void;
}

const DashboardNavbar: FC<NavbarMinimalProps> = ({
  isExpanded,
  toggleExpanded,
  toggleNavbar,
  ...rest
}) => {
  const { classes, theme } = useStyles();
  const isSmallerDevice = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  return (
    <Navbar
      width={{ md: isExpanded ? 300 : 80 }}
      sx={{ overflow: "auto" }}
      height="100%"
      p="md"
      {...rest}
    >
      <Flex justify={isExpanded ? "center" : "flex-start"}>
        <NextLink href="/">
          <BeerdeguLogo
            showText={isSmallerDevice ? true : isExpanded}
            containerProps={{ columnGap: 8 }}
          />
        </NextLink>
      </Flex>

      <Divider my={20} />

      <Navbar.Section grow className={classes.linksSection}>
        {links.map((item) => (
          <LinksGroup
            isExpanded={isSmallerDevice ? true : isExpanded}
            {...item}
            key={item.label}
          />
        ))}
      </Navbar.Section>

      <Divider my={20} />

      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <Navbar.Section>
          <Stack justify="center" align="center" spacing={0}>
            <ActionIcon className={classes.expandIcon} onClick={toggleNavbar}>
              <IconX stroke={1.5} />
            </ActionIcon>
          </Stack>
        </Navbar.Section>
      </MediaQuery>

      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
        <Navbar.Section>
          <Stack justify="center" align="center" spacing={0}>
            <ActionIcon className={classes.expandIcon} onClick={toggleExpanded}>
              {!isExpanded ? (
                <IconArrowRight stroke={1.5} />
              ) : (
                <IconArrowLeft stroke={1.5} />
              )}
            </ActionIcon>
          </Stack>
        </Navbar.Section>
      </MediaQuery>
    </Navbar>
  );
};

export default DashboardNavbar;
