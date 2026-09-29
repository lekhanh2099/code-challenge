import { describe, expect, it } from "vitest";
import {
 calculateReceiveAmount,
 formatAmount,
 formatExchangeRate,
 getAmountError,
 isAllowedAmountInput,
} from "./swap-form-utils";

describe("swap form utilities", () => {
 describe("isAllowedAmountInput", () => {
  it.each(["", ".", "0", "0.", ".5", "12345678901234567890.0123"])(
   "allows %j while typing",
   (amount) => {
    expect(isAllowedAmountInput(amount)).toBe(true);
   },
  );

  it.each(["abc", "12a", "1e3", "-1", "1..2", "1,2"])(
   "rejects %j",
   (amount) => {
    expect(isAllowedAmountInput(amount)).toBe(false);
   },
  );
 });

 describe("getAmountError", () => {
  it.each(["", " ", ".", "0", "-1", "not a number", "Infinity"])(
   "rejects %j",
   (amount) => {
    expect(getAmountError(amount)).toBe(
     "Please enter an amount greater than 0.",
    );
   },
  );

  it("accepts a positive amount", () => {
   expect(getAmountError("2.5")).toBe("");
  });
 });

 it("calculates the receive amount from the two token prices", () => {
  expect(calculateReceiveAmount(2, 1645.935, 1)).toBeCloseTo(3291.87);
 });

 it("formats the displayed amount to at most six decimal places", () => {
  expect(formatAmount(1646.1341364)).toBe("1646.134136");
 });

 it("formats the exchange rate with both token symbols", () => {
  expect(formatExchangeRate("ETH", 1646.134, "USDC", 1)).toBe(
   "1 ETH ≈ 1646.13 USDC",
  );
 });
});
