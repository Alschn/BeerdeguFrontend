'use client';

import { CacheProvider } from '@emotion/react';
import { type ColorScheme, ColorSchemeProvider, MantineProvider, useEmotionCache } from '@mantine/core';
import { Notifications } from "@mantine/notifications";
import { setCookie } from 'cookies-next';
import { useServerInsertedHTML } from 'next/navigation';
import { type FC, type ReactNode, useState } from 'react';

function setBodyTheme(nextColorScheme: string) {
  if (typeof document === 'undefined') return;
  document.body.style.background =
    nextColorScheme === 'light' ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark-7)';
  document.body.style.color =
    nextColorScheme === 'light' ? 'var(--mantine-color-black)' : 'var(--mantine-color-dark-0)';
}

interface RootStyleRegistryProps {
  children: ReactNode;
  scheme?: string;
}

const RootStyleRegistry: FC<RootStyleRegistryProps> = (
  {
    children,
    scheme,
  }
) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const validScheme = (scheme ?? 'light') as ColorScheme;
    setBodyTheme(validScheme);
    return validScheme;
  });

  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setBodyTheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <CacheProvider value={cache}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS withCSSVariables>
          <Notifications/>
          {children}
        </MantineProvider>
      </ColorSchemeProvider>
    </CacheProvider>
  );
};

export default RootStyleRegistry;
