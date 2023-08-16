"use client";

import {
  Anchor,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  createStyles,
  Divider,
  Drawer,
  Group,
  Header,
  HoverCard,
  rem,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
} from "@tabler/icons-react";
import NextLink from "next/link";
import BeerdeguLogo from "~/components/BeerdeguLogo";
import ColorModeToggle from "~/components/ColorModeToggle";
import UserMenu from "~/components/UserMenu";
import { useAuth } from "~/components/context/auth";
import LanguagePicker from "../LanguagePicker";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const useStyles = createStyles((theme) => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },
  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },
  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

const FeaturesHoverCard = () => {
  const { classes, theme } = useStyles();

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <HoverCard
      width={600}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
    >
      <HoverCard.Target>
        <a href="#" className={classes.link}>
          <Center inline>
            <Box component="span" mr={5}>
              Features
            </Box>
            <IconChevronDown size={16} color={theme.fn.primaryColor()} />
          </Center>
        </a>
      </HoverCard.Target>

      <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
        <Group position="apart" px="md">
          <Text fw={500}>Features</Text>
          <Anchor href="#" fz="xs">
            View all
          </Anchor>
        </Group>

        <Divider
          my="sm"
          mx="-md"
          color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
        />

        <SimpleGrid cols={2} spacing={0}>
          {links}
        </SimpleGrid>

        <div className={classes.dropdownFooter}>
          <Group position="apart">
            <div>
              <Text fw={500} fz="sm">
                Get started
              </Text>
              <Text size="xs" color="dimmed">
                Their food sources have decreased, and their numbers
              </Text>
            </div>
            <Button variant="default">Get started</Button>
          </Group>
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

interface HomeHeaderProps {
  height: number;
}

const HomeHeader = ({ height }: HomeHeaderProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { classes, theme } = useStyles();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Header height={height} px="md" withBorder={false} pos="fixed" zIndex={1}>
        <Group position="apart" align="center" sx={{ height: "100%" }}>
          <NextLink href="/">
            <BeerdeguLogo height={48} />
          </NextLink>
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            h="100%"
            className={classes.hiddenMobile}
          >
            <NextLink href="/" className={classes.link}>
              Home
            </NextLink>
            {/* <FeaturesHoverCard /> */}
            {/* <NextLink href="/blog" className={classes.link}>
              Blog
            </NextLink>
            <NextLink href="/contact" className={classes.link}>
              Contact
            </NextLink>
            <NextLink href="/about" className={classes.link}>
              About
            </NextLink> */}
            <Divider orientation="vertical" my={16} />
            <NextLink href="/dashboard" className={classes.link}>
              Dashboard
            </NextLink>
          </Group>

          <Group className={classes.hiddenMobile}>
            <ColorModeToggle />
            {/* <LanguagePicker lang="en" /> */}
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <NextLink href={`/auth/login`}>
                  <Button variant="default">Log in</Button>
                </NextLink>
                <NextLink href={`/auth/register`}>
                  <Button>Sign up</Button>
                </NextLink>
              </>
            )}
          </Group>
          <Group className={classes.hiddenDesktop}>
            <ColorModeToggle />
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              // todo: clean up later
              h={40}
              w={40}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[1],
                "&:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : "white",
                },
              }}
            />
          </Group>
        </Group>
      </Header>
      {/* todo: improve this drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <NextLink href="/">
            <BeerdeguLogo />
          </NextLink>
        }
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <NextLink href="/" className={classes.link}>
            Home
          </NextLink>
          {/* <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse> */}
          {/* <NextLink href="/blog" className={classes.link}>
            Blog
          </NextLink> */}
          <NextLink href="/dashboard" className={classes.link}>
            Dashboard
          </NextLink>
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          {!user && (
            <Group position="center" grow pb="xl" px="md">
              <NextLink href={`/auth/login`}>
                <Button variant="default" fullWidth>
                  Log in
                </Button>
              </NextLink>
              <NextLink href={`/auth/register`}>
                <Button fullWidth>Sign up</Button>
              </NextLink>
            </Group>
          )}
        </ScrollArea>
      </Drawer>
    </>
  );
};

export default HomeHeader;
