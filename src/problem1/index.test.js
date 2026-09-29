import { describe, expect, it } from "vitest";
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./index";

describe.each([
 ["loop", sum_to_n_a],
 ["recursion", sum_to_n_b],
 ["formula", sum_to_n_c],
])("sum to n with %s", (_approach, sumToN) => {
 it.each([
  [0, 0],
  [1, 1],
  [5, 15],
  [1000, 500500],
  [-1, -1],
  [-5, -15],
  [-1000, -500500],
 ])("for n = %i returns %i", (n, expected) => {
  expect(sumToN(n)).toBe(expected);
 });
});
