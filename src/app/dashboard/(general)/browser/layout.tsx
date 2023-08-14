"use client";
import { Box, Card, Tabs } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { type FC, type ReactNode } from "react";

const DashboardBrowserLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const path = pathname.split("/dashboard/browser/")[1];

  const handleRouteChange = (value: string) => {
    router.push(`/dashboard/browser/${value}`);
  };

  return (
    <>
      <Card shadow="xs" p={0} component="nav">
        <Tabs value={path} onTabChange={handleRouteChange}>
          <Tabs.List grow>
            <Tabs.Tab value="beers">Beers</Tabs.Tab>
            <Tabs.Tab value="styles">Beer Styles</Tabs.Tab>
            <Tabs.Tab value="hops">Hops</Tabs.Tab>
            <Tabs.Tab value="breweries">Breweries</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Card>
      <Box component="section">{children}</Box>
    </>
  );
};

export default DashboardBrowserLayout;
