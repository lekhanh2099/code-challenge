import { describe, expect, it } from "vitest";
import { getSortedBalances, type WalletBalance } from "./wallet-balances";

describe("getSortedBalances", () => {
 it("keeps positive balances and sorts by blockchain priority", () => {
  const balances: WalletBalance[] = [
   { blockchain: "Neo", currency: "NEO", amount: 4 },
   { blockchain: "Ethereum", currency: "ETH", amount: 2 },
   { blockchain: "Osmosis", currency: "OSMO", amount: 0 },
   { blockchain: "Arbitrum", currency: "ARB", amount: -1 },
   { blockchain: "Osmosis", currency: "ATOM", amount: 3 },
  ];

  expect(
   getSortedBalances(balances).map((balance) => balance.currency),
  ).toEqual(["ATOM", "ETH", "NEO"]);
 });

 it("keeps the input unchanged and preserves order when priorities match", () => {
  const balances: WalletBalance[] = [
   { blockchain: "Neo", currency: "NEO", amount: 1 },
   { blockchain: "Zilliqa", currency: "ZIL", amount: 2 },
   { blockchain: "Ethereum", currency: "ETH", amount: 3 },
  ];

  expect(
   getSortedBalances(balances).map((balance) => balance.currency),
  ).toEqual(["ETH", "NEO", "ZIL"]);
  expect(balances.map((balance) => balance.currency)).toEqual([
   "NEO",
   "ZIL",
   "ETH",
  ]);
 });
});
