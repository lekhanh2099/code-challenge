// @ts-nocheck
import { useMemo } from "react";
import { getSortedBalances } from "./wallet-balances";

// Keep the existing project imports for:
// - BoxProps
// - useWalletBalances
// - usePrices
// - WalletRow
// - classes (the provided snippet references classes.row but does not show its declaration)

interface Props extends BoxProps {}

const WalletPage = ({ children, ...rest }: Props) => {
 const balances = useWalletBalances();
 const prices = usePrices();

 const sortedBalances = useMemo(() => getSortedBalances(balances), [balances]);

 return (
  <div {...rest}>
   {sortedBalances.map((balance) => {
    // Assumption:
    // usePrices() guarantees a numeric entry for every rendered currency.
    // If that is not guaranteed, define an explicit missing-price UI state.
    const usdValue = prices[balance.currency] * balance.amount;
    // toFixed() keeps the original zero-decimal display until precision is defined.
    const formattedAmount = balance.amount.toFixed();

    return (
     <WalletRow
      className={classes.row}
      key={`${balance.blockchain}:${balance.currency}`}
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={formattedAmount}
     />
    );
   })}

   {children}
  </div>
 );
};

export default WalletPage;
