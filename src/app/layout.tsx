import { cookies } from "next/headers";
import type { FC, ReactNode } from "react";
import RootStyleRegistry from "~/app/_emotion";
import "~/styles/globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  const cookiesStore = cookies();
  const colorScheme = cookiesStore.get('mantine-color-scheme');

  return (
    <html>
    <head>
      <title>Beerdegu</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="description" content="Beerdegu"/>
    </head>
    <body>
    <RootStyleRegistry scheme={colorScheme?.value}>
      {children}
    </RootStyleRegistry>
    </body>
    </html>
  );
};

export default RootLayout;
