import { describe, expect, it } from "vitest";

import { render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import { App } from "./app.tsx";

describe("App", () => {
  it("renders", async () => {
    render(<App />);
    expect(screen.getByText("count is 0")).toBeInTheDocument();

    await userEvent.click(screen.getByText("count is 0"));

    expect(screen.getByText("count is 1")).toBeInTheDocument();
  });
});

