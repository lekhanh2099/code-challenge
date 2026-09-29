const PRICE_API_URL = "https://interview.switcheo.com/prices.json";
export const TOKEN_ICON_BASE_URL =
 "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

export type PriceEntry = {
 currency: string;
 date: string;
 price: number;
};

const isUsablePriceEntry = (entry: object): entry is PriceEntry => {
 // Only keep API rows with the fields needed for a safe exchange calculation.
 if (entry === null || typeof entry !== "object") {
  return false;
 }

 if (
  !("currency" in entry) ||
  typeof entry.currency !== "string" ||
  entry.currency.trim() === ""
 ) {
  return false;
 }

 if (
  !("date" in entry) ||
  typeof entry.date !== "string" ||
  !Number.isFinite(Date.parse(entry.date))
 ) {
  return false;
 }

 return (
  "price" in entry &&
  typeof entry.price === "number" &&
  Number.isFinite(entry.price) &&
  entry.price > 0
 );
};

function normalizePrices(priceEntries: PriceEntry[]): PriceEntry[] {
 const latestPriceByCurrency = new Map<string, PriceEntry>();

 priceEntries.forEach((entry) => {
  const currentEntry = latestPriceByCurrency.get(entry.currency);

  // Prefer the newest date; when dates tie, the later API row wins.
  if (
   !currentEntry ||
   Date.parse(entry.date) >= Date.parse(currentEntry.date)
  ) {
   latestPriceByCurrency.set(entry.currency, entry);
  }
 });

 return Array.from(latestPriceByCurrency.values());
}

export async function fetchLatestPrices(): Promise<PriceEntry[]> {
 const response = await fetch(PRICE_API_URL);

 if (!response.ok) {
  throw new Error("Price request failed");
 }

 const payload: object = await response.json();

 if (!Array.isArray(payload)) {
  throw new Error("Price response is not a list.");
 }

 const priceEntries: object[] = payload;
 const latestPrices = normalizePrices(priceEntries.filter(isUsablePriceEntry));

 // A swap needs two different tokens with usable prices.
 if (latestPrices.length < 2) {
  throw new Error("At least two token prices are required.");
 }

 return latestPrices;
}
