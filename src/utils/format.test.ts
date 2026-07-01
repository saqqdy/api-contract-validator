import { describe, expect, it } from "vitest"
import { formatSeverityBadge, truncate } from "./format"

describe("formatSeverityBadge", () => {
  it("formats breaking badge", () => {
    expect(formatSeverityBadge("breaking")).toBe("[!BREAKING]")
  })
  it("formats warning badge", () => {
    expect(formatSeverityBadge("warning")).toBe("[!WARNING]")
  })
  it("formats info badge", () => {
    expect(formatSeverityBadge("info")).toBe("[INFO]")
  })
})

describe("truncate", () => {
  it("does not truncate short strings", () => {
    expect(truncate("hello", 10)).toBe("hello")
  })
  it("truncates long strings", () => {
    expect(truncate("hello world", 8)).toBe("hello w…")
  })
})
