import { describe, expect, it } from "vitest";

import { render, screen } from "@testing-library/preact";

import { App } from "./app.tsx";

describe("App", () => {
  it("renders a Tradewishes header", async () => {
    render(<App />);
    expect(screen.getByText("Tradewishes")).toBeInTheDocument();
  });
});

