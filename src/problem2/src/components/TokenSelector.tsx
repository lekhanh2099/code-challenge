import {
 Button,
 ChevronDownIcon,
 Popover,
 RadioGroup,
 TextField,
 ThickCheckIcon,
} from "@radix-ui/themes";
import { useState } from "react";
import { TOKEN_ICON_BASE_URL } from "../price-data";

type TokenSelectorProps = {
 id: string;
 label: string;
 currency: string;
 currencies: string[];
 disabled: boolean;
 onCurrencyChange: (currency: string) => void;
};

export default function TokenSelector({
 id,
 label,
 currency,
 currencies,
 disabled,
 onCurrencyChange,
}: TokenSelectorProps) {
 const [failedIconCurrencies, setFailedIconCurrencies] = useState<string[]>([]);
 const [isOpen, setIsOpen] = useState(false);
 const [searchTerm, setSearchTerm] = useState("");
 const iconUrl = `${TOKEN_ICON_BASE_URL}/${encodeURIComponent(currency)}.svg`;
 const normalizedSearchTerm = searchTerm.trim().toLowerCase();
 const filteredCurrencies = currencies.filter((optionCurrency) =>
  optionCurrency.toLowerCase().includes(normalizedSearchTerm),
 );

 const handleOpenChange = (open: boolean) => {
  setIsOpen(open);
  if (!open) {
   setSearchTerm("");
  }
 };

 const handleCurrencyChange = (selectedCurrency: string) => {
  onCurrencyChange(selectedCurrency);
  handleOpenChange(false);
 };

 return (
  <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
   <Popover.Trigger>
    <Button
     id={id}
     type="button"
     className="!mr-0 min-w-[120px] max-w-[150px] justify-between gap-2 rounded-xl px-2 font-semibold text-slate-900"
     variant="ghost"
     color="indigo"
     radius="large"
     size="3"
     aria-label={`${label}: ${currency}`}
     title={currency}
     disabled={disabled}
    >
     {currency ? (
      <span className="inline-flex min-w-0 flex-1 items-center gap-2">
       {!failedIconCurrencies.includes(currency) ? (
        <img
         className="h-[30px] w-[30px] shrink-0 rounded-full bg-white object-contain max-[380px]:h-[26px] max-[380px]:w-[26px]"
         src={iconUrl}
         alt=""
         onError={() =>
          setFailedIconCurrencies((failed) => [...failed, currency])
         }
        />
       ) : (
        <span
         aria-hidden="true"
         className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[9px] font-bold text-indigo-600 max-[380px]:h-[26px] max-[380px]:w-[26px]"
        >
         {currency.slice(0, 4).toUpperCase()}
        </span>
       )}
       <span className="truncate">{currency}</span>
      </span>
     ) : null}
     <ChevronDownIcon
      className="h-4 w-4 shrink-0 text-slate-500"
      aria-hidden="true"
     />
    </Button>
   </Popover.Trigger>
   <Popover.Content
    className="flex max-h-[var(--radix-popover-content-available-height)] w-64 flex-col gap-2 !overflow-hidden p-2"
    side="bottom"
    align="end"
    sideOffset={4}
    aria-label={`${label} options`}
   >
    <TextField.Root
     className="shrink-0"
     autoFocus
     type="search"
     size="2"
     placeholder="Find token..."
     aria-label="Find token"
     autoComplete="off"
     value={searchTerm}
     onChange={(event) => setSearchTerm(event.currentTarget.value)}
    />
    {filteredCurrencies.length > 0 ? (
     <RadioGroup.Root
      className="min-h-0 max-h-64 w-full flex-1 overflow-y-auto"
      aria-label={label}
      value={currency}
      onValueChange={handleCurrencyChange}
     >
      {filteredCurrencies.map((optionCurrency) => (
       <RadioGroup.Item
        key={optionCurrency}
        className="!flex !w-full cursor-pointer items-center rounded-lg px-2 py-1 text-sm font-medium text-slate-800 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 [&:has([data-state=checked])]:bg-indigo-50 [&:has([data-state=checked])]:text-indigo-700 [&_.rt-BaseRadioRoot]:sr-only"
        value={optionCurrency}
       >
        <span className="flex min-w-0 flex-1 items-center gap-2">
         <span
          aria-hidden="true"
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-indigo-600"
         >
          {optionCurrency === currency ? (
           <ThickCheckIcon className="h-3.5 w-3.5" />
          ) : null}
         </span>
         {failedIconCurrencies.includes(optionCurrency) ? (
          <span
           aria-hidden="true"
           className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[7px] font-bold text-indigo-600"
          >
           {optionCurrency.slice(0, 4).toUpperCase()}
          </span>
         ) : (
          <img
           className="h-6 w-6 shrink-0 rounded-full bg-white object-contain"
           src={`${TOKEN_ICON_BASE_URL}/${encodeURIComponent(optionCurrency)}.svg`}
           alt=""
           onError={() =>
            setFailedIconCurrencies((failed) => [...failed, optionCurrency])
           }
          />
         )}
         <span>{optionCurrency}</span>
        </span>
       </RadioGroup.Item>
      ))}
     </RadioGroup.Root>
    ) : (
     <p className="px-2 py-1 text-sm text-slate-500">No tokens found.</p>
    )}
   </Popover.Content>
  </Popover.Root>
 );
}
