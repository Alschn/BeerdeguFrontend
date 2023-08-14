import { cookies } from "next/headers";
import type { ReactNode } from "react";
import RootStyleRegistry from "~/app/_emotion";
import ScrollToTopButton from "~/components/ScrollToTopButton";
import AuthProvider from "~/components/context/auth";
import QueryClientProvider from "~/components/providers/tanstack";
import { ACCESS_TOKEN_KEY } from "~/config";
import "~/styles/globals.css";

const COLOR_SCHEME_COOKIE = "mantine-color-scheme";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const cookiesStore = cookies();
  const colorScheme = cookiesStore.get(COLOR_SCHEME_COOKIE);
  const accessToken = cookiesStore.get(ACCESS_TOKEN_KEY);

  return (
    <html>
      <head>
        <title>Beerdegu</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Beerdegu" />
        <meta name="author" content="Alschn" />
        <meta
          name="keywords"
          content="beerdegu, beer, beers, tasting, session, piwo, piwa, degustacja, online"
        />
      </head>
      <body>
        <RootStyleRegistry scheme={colorScheme?.value}>
          <AuthProvider token={accessToken?.value}>
            <QueryClientProvider>{children}</QueryClientProvider>
          </AuthProvider>
          <ScrollToTopButton />
        </RootStyleRegistry>
      </body>
    </html>
  );
}
