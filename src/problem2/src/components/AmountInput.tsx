import { TextField } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

type AmountInputProps = Omit<
 ComponentProps<typeof TextField.Root>,
 "children" | "className" | "color" | "id" | "radius" | "size" | "variant"
> & {
 hasError: boolean;
 id: string;
 label: string;
 suffix: ReactNode;
};

const amountFieldClassName =
 "!h-20 w-full min-w-0 rounded-2xl !text-xl font-semibold tracking-tight text-slate-900 sm:!text-2xl [&_.rt-TextFieldInput]:min-w-0";

function AmountInput({
 hasError,
 id,
 label,
 suffix,
 ...inputProps
}: AmountInputProps) {
 return (
  <div className="flex flex-col gap-2">
   <label className="text-sm font-semibold sm:text-base" htmlFor={id}>
    {label}
   </label>
   <TextField.Root
    {...inputProps}
    className={`${amountFieldClassName} ${hasError ? "!ring-1 !ring-red-500" : ""}`}
    color="indigo"
    id={id}
    radius="large"
    size="3"
    variant="surface"
    aria-invalid={hasError}
   >
    <TextField.Slot className="pr-2" side="right">
     {suffix}
    </TextField.Slot>
   </TextField.Root>
  </div>
 );
}

export default AmountInput;
