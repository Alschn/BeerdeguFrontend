"use client";

import { CacheProvider } from "@emotion/react";
import {
  type ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useEmotionCache,
  type MantineThemeOverride,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { setCookie } from "cookies-next";
import { useServerInsertedHTML } from "next/navigation";
import { type FC, type ReactNode, useState } from "react";

const LIGHT_MODE_BACKGROUND = "var(--mantine-color-white)";
const DARK_MODE_BACKGROUND = "var(--mantine-color-dark-7)";
const LIGHT_MODE_COLOR = "var(--mantine-color-black)";
const DARK_MODE_COLOR = "var(--mantine-color-dark-0)";

function setBodyTheme(nextColorScheme: string) {
  if (typeof document === "undefined") return;
  document.body.style.background =
    nextColorScheme === "light" ? LIGHT_MODE_BACKGROUND : DARK_MODE_BACKGROUND;
  document.body.style.color =
    nextColorScheme === "light" ? LIGHT_MODE_COLOR : DARK_MODE_COLOR;
}

interface RootStyleRegistryProps {
  children: ReactNode;
  scheme?: string;
}

const RootStyleRegistry: FC<RootStyleRegistryProps> = ({
  children,
  scheme,
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const validScheme = (scheme ?? "light") as ColorScheme;
    setBodyTheme(validScheme);
    return validScheme;
  });

  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setBodyTheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  // https://mantine.dev/theming/theme-object/
  const theme: MantineThemeOverride = {
    colorScheme,
  };

  return (
    <CacheProvider value={cache}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={theme}
          withGlobalStyles
          withNormalizeCSS
          withCSSVariables
        >
          <Notifications position="top-right" />
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </CacheProvider>
  );
};

export default RootStyleRegistry;
