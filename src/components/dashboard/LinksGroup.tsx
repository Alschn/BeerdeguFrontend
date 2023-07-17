import { useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  rem,
  getStylesRef,
  Tooltip,
  Popover,
} from "@mantine/core";
import { IconChevronRight, type TablerIconsProps } from "@tabler/icons-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },

  nestedLink: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

interface LinksGroupProps {
  icon: React.FC<TablerIconsProps>;
  label: string;
  isExpanded: boolean;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  link,
  links,
  icon: Icon,
  label,
  initiallyOpened,
  isExpanded,
}: LinksGroupProps) {
  const pathname = usePathname();
  const { classes, cx } = useStyles();

  const [opened, setOpened] = useState(initiallyOpened || false);

  const itemLinks = links ?? [];
  const items = itemLinks.map((link) => (
    <NextLink
      href={link.link}
      key={link.label}
      className={cx(classes.nestedLink, {
        [classes.linkActive]: pathname === link.link,
      })}
    >
      {link.label}
    </NextLink>
  ));

  if (link && isExpanded)
    return (
      <NextLink href={link} key={label}>
        <UnstyledButton
          className={cx(classes.control, {
            [classes.linkActive]: pathname === link,
          })}
        >
          <Group position="apart" spacing={0}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ThemeIcon variant="light" size={30}>
                <Icon size="1.1rem" />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
          </Group>
        </UnstyledButton>
      </NextLink>
    );

  if (link && !isExpanded)
    return (
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <NextLink href={link} key={label}>
          <UnstyledButton
            className={cx(classes.control, {
              [classes.linkActive]: pathname === link,
            })}
          >
            <Group position="center" spacing={0}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ThemeIcon variant="light" size={30}>
                  <Icon size="1.1rem" />
                </ThemeIcon>
              </Box>
            </Group>
          </UnstyledButton>
        </NextLink>
      </Tooltip>
    );

  if (!isExpanded)
    return (
      <Popover position="right-start" offset={-20} closeOnClickOutside>
        <Popover.Target>
          <Tooltip
            label={label}
            position="right"
            transitionProps={{ duration: 0 }}
          >
            <UnstyledButton className={classes.control}>
              <Group position={isExpanded ? "apart" : "center"} spacing={0}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ThemeIcon variant="light" size={30}>
                    <Icon size="1.1rem" />
                  </ThemeIcon>
                </Box>
              </Group>
            </UnstyledButton>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown p={0}>
          {itemLinks.map((link) => (
            <NextLink href={link.link} key={label}>
              <UnstyledButton
                className={cx(classes.control, {
                  [classes.linkActive]: link.link === pathname,
                })}
              >
                <Group position={"apart"} spacing={0}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box mx="md">{link.label}</Box>
                  </Box>
                </Group>
              </UnstyledButton>
            </NextLink>
          ))}
        </Popover.Dropdown>
      </Popover>
    );

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position={isExpanded ? "apart" : "center"} spacing={0}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <ThemeIcon variant="light" size={30}>
              <Icon size="1.1rem" />
            </ThemeIcon>

            {isExpanded && <Box ml="md">{label}</Box>}
          </Box>

          {isExpanded && (
            <IconChevronRight
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? `rotate(90deg)` : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {isExpanded && <Collapse in={opened}>{items}</Collapse>}
    </>
  );
}
