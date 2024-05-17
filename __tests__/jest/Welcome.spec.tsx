import { render, screen } from "@testing-library/react";
import Welcome from "~/components/home/Welcome";
import { wrapper } from "./utils";

jest.mock("next/navigation", () => ({
  useRouter: () => {},
}));

describe("Welcome component", () => {
  it("has correct Next.js theming section link", () => {
    render(<Welcome />, { wrapper });
    expect(screen.getByText("Beerdegu")).toBeInTheDocument();
  });
});
