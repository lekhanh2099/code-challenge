const AMOUNT_ERROR_MESSAGE = "Please enter an amount greater than 0.";

export function isAllowedAmountInput(value: string): boolean {
 // Keep unfinished decimals editable; submit validation handles values like ".".
 return /^\d*\.?\d*$/.test(value);
}

export function getAmountError(amount: string): string {
 const amountValue = Number(amount);

 if (
  amount.trim() === "" ||
  !Number.isFinite(amountValue) ||
  amountValue <= 0
 ) {
  return AMOUNT_ERROR_MESSAGE;
 }

 return "";
}

export function calculateReceiveAmount(
 amount: number,
 fromPrice: number,
 toPrice: number,
): number {
 return (amount * fromPrice) / toPrice;
}

export function formatAmount(amount: number): string {
 return new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  useGrouping: false,
 }).format(amount);
}

export function formatExchangeRate(
 fromCurrency: string,
 fromPrice: number,
 toCurrency: string,
 toPrice: number,
): string {
 const rate = new Intl.NumberFormat("en-US", {
  maximumSignificantDigits: 6,
  useGrouping: false,
 }).format(fromPrice / toPrice);

 return `1 ${fromCurrency} ≈ ${rate} ${toCurrency}`;
}
