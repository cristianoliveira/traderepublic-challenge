import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/preact";
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
