import { goodListingsOnly } from "./clock";
import { badListing, goodListing } from "./clock.mock";

describe("etsy listings", () => {
  it("should filter out bad listings", () => {
    expect(goodListingsOnly(badListing)).toBe(false);
  });
  it("should keep good listings", () => {
    expect(goodListingsOnly(goodListing)).toBe(true);
  });
});
