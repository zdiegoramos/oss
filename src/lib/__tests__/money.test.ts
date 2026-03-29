import { describe, expect, it } from "vitest";
import {
  nonNegativeMoney,
  sumMoney,
  toMoneyCents,
  toMoneyString,
} from "../money";

describe("toMoneyString", () => {
  it("formats an integer as a 2-decimal string", () => {
    expect(toMoneyString(10)).toBe("10.00");
  });

  it("rounds to 2 decimal places", () => {
    expect(toMoneyString(1.005)).toBe("1.01");
  });
});

describe("toMoneyCents", () => {
  it("converts dollars to cents", () => {
    expect(toMoneyCents(1)).toBe(100);
  });

  it("handles fractional dollars", () => {
    expect(toMoneyCents(9.99)).toBe(999);
  });
});

describe("sumMoney", () => {
  it("sums an array of values", () => {
    expect(sumMoney([1, 2, 3]).toNumber()).toBe(6);
  });

  it("returns 0 for an empty array", () => {
    expect(sumMoney([]).toNumber()).toBe(0);
  });
});

describe("nonNegativeMoney", () => {
  it("returns positive values unchanged", () => {
    expect(nonNegativeMoney(5).toNumber()).toBe(5);
  });

  it("clamps negative values to 0", () => {
    expect(nonNegativeMoney(-3).toNumber()).toBe(0);
  });
});
