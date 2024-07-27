import { describe, it, expect } from "vitest";
import { validateISIN } from "./isin";

describe("validateISIN", () => {
  it.each([
    ["US0378331005", true],
    ["US38259P5089", true],
    ["US0378331006", false],
    ["US037833100", false],
    ["US03783310055", false],
    ["", false],
  ])("validates ISINs $0 ", (isin, expected) => {
    expect(validateISIN(isin)).toBe(expected);
  });
});
