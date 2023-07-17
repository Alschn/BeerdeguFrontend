import { getBreadcrumbsFromPaths } from "~/components/dashboard/Breadcrumbs";

describe("Paths (string array) to Breadcrumbs", () => {
  it("should return an array of one breadcrumb", () => {
    const paths = ["dashboard"];
    const breadcrumbs = getBreadcrumbsFromPaths(paths);
    expect(breadcrumbs).toEqual([
      {
        name: "Dashboard",
        segment: "dashboard",
        path: "/dashboard",
      },
    ]);
  });

  it("should return an array of breadcrumbs", () => {
    const paths = ["dashboard", "rooms", "join"];
    const breadcrumbs = getBreadcrumbsFromPaths(paths);
    expect(breadcrumbs).toEqual([
      {
        name: "Dashboard",
        segment: "dashboard",
        path: "/dashboard",
      },
      {
        name: "Rooms",
        segment: "rooms",
        path: "/dashboard/rooms",
      },
      {
        name: "Join",
        segment: "join",
        path: "/dashboard/rooms/join",
      },
    ]);
  });
});
