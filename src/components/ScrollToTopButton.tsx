"use client";

import {
  ActionIcon,
  Affix,
  Transition,
  createStyles,
  rem,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconChevronUp } from "@tabler/icons-react";
import { type FC } from "react";

const useStyles = createStyles((theme) => ({
  button: {
    height: 48,
    width: 48,
    borderRadius: theme.radius.xl,
    boxShadow: "0 2px 12px 0 rgb(0 0 0 / 16%)",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

const SCROLL_THRESHOLD = 250;

const ScrollToTopButton: FC = () => {
  const { classes } = useStyles();
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: rem(24), right: rem(24) }}>
      <Transition transition="slide-up" mounted={scroll.y > SCROLL_THRESHOLD}>
        {(transitionStyles) => (
          <ActionIcon
            id="scroll-to-top-button"
            style={transitionStyles}
            className={classes.button}
            onClick={() => scrollTo({ y: 0 })}
          >
            <IconChevronUp />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
};

export default ScrollToTopButton;
