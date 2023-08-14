import { Anchor, Breadcrumbs, Flex, Title } from "@mantine/core";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

type Breadcrumb = {
  name: string;
  segment: string;
  path: string;
};

export const getBreadcrumbsFromPaths = (paths: string[]) => {
  return paths.reduce<Breadcrumb[]>((prevValue, currentValue, currentIndex) => {
    let previousItem: Breadcrumb | undefined;
    const prevIndex = currentIndex - 1;
    if (prevIndex !== -1) {
      previousItem = prevValue[prevIndex] as unknown as Breadcrumb;
    }

    const newArray = [
      ...prevValue,
      {
        name: currentValue.charAt(0).toUpperCase() + currentValue.slice(1),
        segment: currentValue,
        // todo: fix case when home page was included in paths
        path: previousItem
          ? `${previousItem.path}/${currentValue}`
          : `/${currentValue}`,
      },
    ];
    return newArray;
  }, []);
};

export default function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = getBreadcrumbsFromPaths(paths);
  const title = breadcrumbs[breadcrumbs.length - 1];
  const currentPathName = title?.name as string;

  return (
    <Flex direction="column" justify="center">
      <Breadcrumbs>
        {breadcrumbs.map(({ path, name }) => (
          <Anchor key={path} href={path} component={NextLink}>
            {name}
          </Anchor>
        ))}
      </Breadcrumbs>
      <Title order={2}>{currentPathName}</Title>
    </Flex>
  );
}
