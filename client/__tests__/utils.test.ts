import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatPrice, cloudinaryOptimize, timeAgo } from "../lib/utils";

describe("formatPrice", () => {
  it("formats a simple number with rupee symbol", () => {
    expect(formatPrice(100)).toBe("₹100");
  });

  it("formats large numbers with Indian locale separators", () => {
    expect(formatPrice(1500)).toBe("₹1,500");
    expect(formatPrice(100000)).toBe("₹1,00,000");
  });

  it("formats zero correctly", () => {
    expect(formatPrice(0)).toBe("₹0");
  });
});

describe("cloudinaryOptimize", () => {
  const cloudinaryUrl =
    "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  it("injects f_auto,q_auto,w_ transformation into a Cloudinary URL", () => {
    const result = cloudinaryOptimize(cloudinaryUrl, 400);
    expect(result).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400/sample.jpg"
    );
  });

  it("uses default width 400 when none provided", () => {
    const result = cloudinaryOptimize(cloudinaryUrl);
    expect(result).toContain("w_400");
  });

  it("returns non-Cloudinary URLs unchanged (e.g. Google profile images)", () => {
    const googleUrl =
      "https://lh3.googleusercontent.com/a/ACg8ocKx=s96-c";
    expect(cloudinaryOptimize(googleUrl, 72)).toBe(googleUrl);
  });

  it("returns plain strings without /upload/ unchanged", () => {
    expect(cloudinaryOptimize("https://example.com/photo.jpg")).toBe(
      "https://example.com/photo.jpg"
    );
  });
});

describe("timeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
  });

  it("returns 'Just now' for less than 2 minutes ago", () => {
    const oneMinuteAgo = new Date("2024-06-01T11:59:00Z").toISOString();
    expect(timeAgo(oneMinuteAgo)).toBe("Just now");
  });

  it("returns minutes ago for recent posts", () => {
    const thirtyMinAgo = new Date("2024-06-01T11:30:00Z").toISOString();
    expect(timeAgo(thirtyMinAgo)).toBe("30m ago");
  });

  it("returns hours ago for same-day posts", () => {
    const threeHoursAgo = new Date("2024-06-01T09:00:00Z").toISOString();
    expect(timeAgo(threeHoursAgo)).toBe("3h ago");
  });

  it("returns 'Yesterday' for posts from yesterday", () => {
    const yesterday = new Date("2024-05-31T12:00:00Z").toISOString();
    expect(timeAgo(yesterday)).toBe("Yesterday");
  });

  it("returns days ago for posts within the last week", () => {
    const fourDaysAgo = new Date("2024-05-28T12:00:00Z").toISOString();
    expect(timeAgo(fourDaysAgo)).toBe("4 days ago");
  });

  it("returns weeks ago for posts older than a week", () => {
    const twoWeeksAgo = new Date("2024-05-18T12:00:00Z").toISOString();
    expect(timeAgo(twoWeeksAgo)).toBe("2w ago");
  });

  it("returns months ago for posts older than a month", () => {
    const twoMonthsAgo = new Date("2024-04-01T12:00:00Z").toISOString();
    expect(timeAgo(twoMonthsAgo)).toBe("2mo ago");
  });
});
