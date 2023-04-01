import type { FC, ReactNode } from "react";
import "~/styles/globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html>
    <head>
      <title>Beerdegu</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="description" content="Beerdegu"/>
    </head>
    <body>{children}</body>
    </html>
  );
};

export default RootLayout;
