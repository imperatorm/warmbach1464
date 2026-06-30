import { describe, it, expect } from "vitest";
import { parseSeatNo, isValidMemberId, checkAccess } from "./member";
import type { Member } from "./types";

const M: Member = {
  id: "1464.0007",
  name: "Demo",
  seatNo: 7,
  joinedYear: 2026,
  accessCode: "1464",
  privileges: ["P1"],
};

describe("parseSeatNo", () => {
  it("parses a valid id to its seat number", () => {
    expect(parseSeatNo("1464.0007")).toBe(7);
    expect(parseSeatNo("1464.1464")).toBe(1464);
  });
  it("trims surrounding whitespace", () => {
    expect(parseSeatNo("  1464.0007 ")).toBe(7);
  });
  it("rejects out-of-range seats", () => {
    expect(parseSeatNo("1464.0000")).toBeNull();
    expect(parseSeatNo("1464.1465")).toBeNull();
  });
  it("rejects malformed ids", () => {
    expect(parseSeatNo("1464.007")).toBeNull(); // needs 4 digits
    expect(parseSeatNo("1463.0007")).toBeNull();
    expect(parseSeatNo("foo")).toBeNull();
    expect(parseSeatNo("")).toBeNull();
  });
});

describe("isValidMemberId", () => {
  it("is true for valid, false otherwise", () => {
    expect(isValidMemberId("1464.0001")).toBe(true);
    expect(isValidMemberId("1464.9999")).toBe(false);
  });
});

describe("checkAccess", () => {
  it("admits the matching id + code", () => {
    expect(checkAccess("1464.0007", "1464", M)).toBe(true);
    expect(checkAccess(" 1464.0007 ", " 1464 ", M)).toBe(true);
  });
  it("rejects a wrong code", () => {
    expect(checkAccess("1464.0007", "0000", M)).toBe(false);
  });
  it("rejects a non-member id", () => {
    expect(checkAccess("1464.0008", "1464", M)).toBe(false);
  });
});
