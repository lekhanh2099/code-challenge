import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchLatestPrices } from "./price-data";

describe("fetchLatestPrices", () => {
 afterEach(() => {
  vi.restoreAllMocks();
 });

 it("keeps usable prices and the latest record for each currency", async () => {
  vi
   .spyOn(globalThis, "fetch")
   .mockResolvedValue(
    new Response(
     JSON.stringify([
      { currency: "ETH", date: "2024-01-01T00:00:00Z", price: 100 },
      { currency: "USDC", date: "2024-01-01T00:00:00Z", price: 1 },
      { currency: "ETH", date: "2025-01-01T00:00:00Z", price: 200 },
      { currency: "ETH", date: "2025-01-01T00:00:00Z", price: 250 },
      { currency: "", date: "2025-01-01T00:00:00Z", price: 1 },
      { currency: "BAD", date: "invalid", price: 1 },
      { currency: "FREE", date: "2025-01-01T00:00:00Z", price: 0 },
      { currency: "MISSING", date: "2025-01-01T00:00:00Z" },
      null,
     ]),
    ),
   );

  await expect(fetchLatestPrices()).resolves.toEqual([
   { currency: "ETH", date: "2025-01-01T00:00:00Z", price: 250 },
   { currency: "USDC", date: "2024-01-01T00:00:00Z", price: 1 },
  ]);
 });

 it("rejects a response that is not a list", async () => {
  vi
   .spyOn(globalThis, "fetch")
   .mockResolvedValue(
    new Response(JSON.stringify({ currency: "ETH", price: 100 })),
   );

  await expect(fetchLatestPrices()).rejects.toThrow(
   "Price response is not a list.",
  );
 });

 it("rejects a list without two usable token prices", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
   new Response(
    JSON.stringify([
     { currency: "ETH", date: "2025-01-01T00:00:00Z", price: 100 },
     { currency: "ETH", date: "2024-01-01T00:00:00Z", price: 90 },
     { currency: "USDC", date: "2025-01-01T00:00:00Z", price: null },
    ]),
   ),
  );

  await expect(fetchLatestPrices()).rejects.toThrow(
   "At least two token prices are required.",
  );
 });
});
