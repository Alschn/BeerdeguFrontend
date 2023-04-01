import { test, expect } from "@playwright/experimental-ct-react";
import Welcome from "../../src/components/Welcome";


test("Welcome component has correct text", async ({ mount }) => {
  const component = await mount(<Welcome/>);
  await expect(component.locator("h1")).toContainText("Welcome to Beerdegu");
});
