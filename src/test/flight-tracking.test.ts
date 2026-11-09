import { describe, expect, it } from "vitest";

import { isValidDemoTrackingNumber } from "@/lib/flight-tracking";

describe("demo flight tracking number", () => {
  it("accepts the supplied tracking number", () => {
    expect(isValidDemoTrackingNumber("fh3948598014")).toBe(true);
  });

  it("does not accept another number", () => {
    expect(isValidDemoTrackingNumber("fh3948598015")).toBe(false);
  });
});