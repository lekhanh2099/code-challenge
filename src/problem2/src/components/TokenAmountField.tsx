import type { ComponentProps } from "react";
import AmountInput from "./AmountInput";
import TokenSelector from "./TokenSelector";

type TokenAmountFieldProps = Omit<
 ComponentProps<typeof AmountInput>,
 "suffix"
> & {
 currency: string;
 currencies: string[];
 disabled: boolean;
 onCurrencyChange: (currency: string) => void;
 tokenId: string;
 tokenLabel: string;
};

function TokenAmountField({
 currency,
 currencies,
 disabled,
 onCurrencyChange,
 tokenId,
 tokenLabel,
 ...inputProps
}: TokenAmountFieldProps) {
 // Keep AmountInput generic; this swap-specific field supplies the token control.
 return (
  <AmountInput
   {...inputProps}
   disabled={disabled}
   suffix={
    <TokenSelector
     id={tokenId}
     label={tokenLabel}
     currency={currency}
     currencies={currencies}
     onCurrencyChange={onCurrencyChange}
     disabled={disabled}
    />
   }
  />
 );
}

export default TokenAmountField;
