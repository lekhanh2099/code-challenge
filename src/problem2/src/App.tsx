import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { Button } from "@radix-ui/themes";
import { fetchLatestPrices } from "./price-data";
import type { PriceEntry } from "./price-data";
import TokenAmountField from "./components/TokenAmountField";
import {
 calculateReceiveAmount,
 formatAmount,
 formatExchangeRate,
 getAmountError,
 isAllowedAmountInput,
} from "./swap-form-utils";

function App() {
 const [prices, setPrices] = useState<PriceEntry[]>([]);
 const [fromToken, setFromToken] = useState("");
 const [toToken, setToToken] = useState("");
 const [amount, setAmount] = useState("");
 const [hasTouchedAmount, setHasTouchedAmount] = useState(false);
 const [isPriceLoading, setIsPriceLoading] = useState(true);
 const [hasPriceError, setHasPriceError] = useState(false);
 const [isProcessing, setIsProcessing] = useState(false);
 const [swapResult, setSwapResult] = useState("");
 const activePriceRequest = useRef(0);

 const loadPrices = async () => {
  // A later load (or unmount) makes earlier responses irrelevant.
  const requestId = ++activePriceRequest.current;
  setIsPriceLoading(true);
  setHasPriceError(false);

  try {
   const loadedPrices = await fetchLatestPrices();

   if (requestId !== activePriceRequest.current) {
    return;
   }

   // Use familiar defaults when available, while keeping any two priced tokens usable.
   const initialFromPrice =
    loadedPrices.find((entry) => entry.currency === "ETH") ?? loadedPrices[0];

   if (!initialFromPrice) {
    throw new Error("No token price is available.");
   }

   const initialToPrice =
    loadedPrices.find(
     (entry) =>
      entry.currency === "USDC" && entry.currency !== initialFromPrice.currency,
    ) ??
    loadedPrices.find((entry) => entry.currency !== initialFromPrice.currency);

   if (!initialToPrice) {
    throw new Error("No second token is available.");
   }

   // Sort once per load so searching only filters the displayed currencies.
   setPrices(
    [...loadedPrices].sort((left, right) =>
     left.currency.localeCompare(right.currency, "en", { sensitivity: "base" }),
    ),
   );
   setFromToken(initialFromPrice.currency);
   setToToken(initialToPrice.currency);
  } catch {
   if (requestId === activePriceRequest.current) {
    setHasPriceError(true);
   }
  } finally {
   if (requestId === activePriceRequest.current) {
    setIsPriceLoading(false);
   }
  }
 };

 useEffect(() => {
  void loadPrices();
  return () => {
   activePriceRequest.current += 1;
  };
 }, []);

 const fromPrice =
  prices.find((entry) => entry.currency === fromToken)?.price ?? 0;
 const toPrice = prices.find((entry) => entry.currency === toToken)?.price ?? 0;
 const amountValue = Number(amount);
 const amountError = getAmountError(amount);
 const currencies = prices.map((entry) => entry.currency);
 const fromCurrencies = currencies.filter((currency) => currency !== toToken);
 const toCurrencies = currencies.filter((currency) => currency !== fromToken);
 // The quote follows the current amount and token choices; it does not need state.
 const canCalculate =
  !isPriceLoading && !hasPriceError && fromPrice > 0 && toPrice > 0;
 const receiveAmount =
  canCalculate && !amountError
   ? calculateReceiveAmount(amountValue, fromPrice, toPrice)
   : 0;
 const outputAmount =
  canCalculate && !amountError ? formatAmount(receiveAmount) : "";
 const shouldShowAmountError = hasTouchedAmount && amountError !== "";
 // Allow an invalid submit attempt so the form can explain the amount error.
 const canAttemptSubmit = canCalculate && !isProcessing && swapResult === "";
 const controlsDisabled =
  isPriceLoading || hasPriceError || isProcessing || swapResult !== "";

 let rateText = "";

 if (isPriceLoading) {
  rateText = "Loading token prices…";
 } else if (hasPriceError) {
  rateText = "Token prices are unavailable.";
 } else if (fromPrice && toPrice) {
  rateText = formatExchangeRate(fromToken, fromPrice, toToken, toPrice);
 }

 const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();
  setHasTouchedAmount(true);

  if (!canAttemptSubmit || amountError) {
   return;
  }

  const summary = `${formatAmount(amountValue)} ${fromToken} → ${formatAmount(receiveAmount)} ${toToken}`;

  // Submission is mocked for this challenge; the delay exposes processing state.
  setIsProcessing(true);
  window.setTimeout(() => {
   setIsProcessing(false);
   setSwapResult(summary);
  }, 1000);
 };

 const handleRetryPrices = () => {
  void loadPrices();
 };

 const handleAnotherSwap = () => {
  setAmount("");
  setHasTouchedAmount(false);
  setSwapResult("");
  window.requestAnimationFrame(() => {
   document.getElementById("input-amount")?.focus();
  });
 };

 const handleAmountChange = (value: string) => {
  if (!isAllowedAmountInput(value)) {
   return;
  }

  setAmount(value);
  setHasTouchedAmount(true);
  setSwapResult("");
 };

 const handleReverseDirection = () => {
  setFromToken(toToken);
  setToToken(fromToken);
 };

 return (
  <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
   <section
    className="flex w-full max-w-[480px] flex-col gap-8 rounded-[28px] border border-[#e9edf8] bg-white p-6 shadow-[0_22px_70px_rgba(51,65,120,0.12)] sm:p-8"
    aria-labelledby="swap-title"
   >
    {swapResult ? (
     <div
      className="flex flex-col gap-1 rounded-2xl bg-green-50 p-4 text-green-700"
      role="status"
      aria-live="polite"
     >
      <p className="font-semibold">Swap successful</p>
      <p className="break-words text-sm">{swapResult}</p>
     </div>
    ) : null}

    <header className="flex flex-col gap-1">
     <h1
      id="swap-title"
      className="text-3xl font-bold tracking-tight sm:text-[34px]"
     >
      Swap
     </h1>
     <p className="text-base text-slate-500 sm:text-lg">
      Instant token conversion
     </p>
    </header>

    {hasPriceError ? (
     <div
      className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
      role="alert"
     >
      <div className="flex flex-col gap-1">
       <p className="font-medium">Couldn't load token prices.</p>
       <p className="text-sm">Please try again.</p>
      </div>
      <Button
       type="button"
       variant="soft"
       color="red"
       onClick={handleRetryPrices}
      >
       Retry
      </Button>
     </div>
    ) : null}

    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
     <div className="flex flex-col gap-2">
      <TokenAmountField
       id="input-amount"
       label="You pay"
       tokenId="from-token"
       tokenLabel="Token to send"
       currency={fromToken}
       currencies={fromCurrencies}
       onCurrencyChange={setFromToken}
       type="text"
       inputMode="decimal"
       placeholder="0.00"
       autoComplete="off"
       aria-describedby="amount-error"
       value={amount}
       onChange={(event) => handleAmountChange(event.currentTarget.value)}
       onBlur={() => setHasTouchedAmount(true)}
       disabled={controlsDisabled}
       hasError={shouldShowAmountError}
      />
      <p
       id="amount-error"
       className={
        shouldShowAmountError
         ? "text-sm text-red-600"
         : "hidden text-sm text-red-600"
       }
       role="alert"
      >
       {shouldShowAmountError ? amountError : ""}
      </p>
     </div>

     <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-slate-200"></span>
      <Button
       className="!h-14 !w-14 !min-w-0 shrink-0 !p-0 !text-[28px]"
       type="button"
       variant="surface"
       color="indigo"
       radius="full"
       aria-label="Reverse token direction"
       title="Reverse token direction"
       onClick={handleReverseDirection}
       disabled={controlsDisabled}
      >
       ⇅
      </Button>
      <span className="h-px flex-1 bg-slate-200"></span>
     </div>

     <div className="flex flex-col gap-4">
      <TokenAmountField
       id="output-amount"
       label="You receive"
       tokenId="to-token"
       tokenLabel="Token to receive"
       currency={toToken}
       currencies={toCurrencies}
       onCurrencyChange={setToToken}
       type="text"
       placeholder="0.00"
       value={outputAmount}
       readOnly
       aria-label="Estimated amount to receive"
       disabled={controlsDisabled}
       hasError={false}
      />
      <p
       className="min-h-12 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
       role="status"
       aria-live="polite"
      >
       {rateText}
      </p>
     </div>

     <div className="flex flex-col gap-6">
      {/* Remount the action button so Enter cannot submit its replacement after a reset. */}
      {swapResult ? (
       <Button
        key="another-swap"
        className="!w-full"
        type="button"
        variant="outline"
        color="indigo"
        size="4"
        radius="large"
        onClick={handleAnotherSwap}
       >
        Make another swap
       </Button>
      ) : (
       <Button
        key="confirm-swap"
        className="!min-h-16 !w-full"
        type="submit"
        variant="solid"
        color="indigo"
        size="4"
        radius="large"
        disabled={!canAttemptSubmit}
       >
        {isProcessing ? "Processing…" : "Confirm Swap"}
       </Button>
      )}

      <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
       Estimated amount based on the latest available prices.
      </p>
     </div>
    </form>
   </section>
  </main>
 );
}

export default App;
