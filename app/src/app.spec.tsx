import { describe, expect, it } from "vitest";

import { render, screen } from "@testing-library/preact";
// import userEvent from "@testing-library/user-event";

import { App } from "./app.tsx";

describe("App", () => {
  it("renders", () => {
    render(<App />);
    expect(screen.getByText("count is 0")).toBeInTheDocument();
  });
});

