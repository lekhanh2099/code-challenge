// @ts-nocheck
// Review of the supplied snippet. Its hook, component, and style imports were not provided.
interface WalletBalance {
 // Issue: blockchain is read below but is missing from this type.
 currency: string;
 amount: number;
}
interface FormattedWalletBalance {
 currency: string;
 amount: number;
 formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
 // Issue: children is removed from rest but never rendered.
 const { children, ...rest } = props;
 const balances = useWalletBalances();
 const prices = usePrices();

 // Issue: any removes type checking; this pure helper need not be recreated per render.
 const getPriority = (blockchain: any): number => {
  switch (blockchain) {
   case "Osmosis":
    return 100;
   case "Ethereum":
    return 50;
   case "Arbitrum":
    return 30;
   case "Zilliqa":
    return 20;
   case "Neo":
    return 20;
   default:
    // Issue: the -99 sentinel is also used in the filter below.
    return -99;
  }
 };

 const sortedBalances = useMemo(() => {
  return balances
   .filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    // Bug: lhsPriority is undefined; the computed name is balancePriority.
    if (lhsPriority > -99) {
     // Assumption to confirm: should a wallet list keep non-positive amounts?
     if (balance.amount <= 0) {
      return true;
     }
    }
    return false;
   })
   .sort((lhs: WalletBalance, rhs: WalletBalance) => {
    // Bug: equal priorities (Neo/Zilliqa) return nothing instead of 0.
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
     return -1;
    } else if (rightPriority > leftPriority) {
     return 1;
    }
   });
  // Issue: prices is not read above, so its changes needlessly repeat the sort.
 }, [balances, prices]);

 // Issue: this formatted array is never used to build the rows.
 const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
   ...balance,
   formatted: balance.amount.toFixed(),
  };
 });

 // Bug: annotating balance does not add the formatted property at runtime.
 const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
   // Assumption: a missing currency price would make usdValue NaN.
   const usdValue = prices[balance.currency] * balance.amount;
   // Issue: index keys can identify a different row after filtering or sorting.
   return (
    <WalletRow
     className={classes.row}
     key={index}
     amount={balance.amount}
     usdValue={usdValue}
     formattedAmount={balance.formatted}
    />
   );
  },
 );

 return <div {...rest}>{rows}</div>;
};
