const BLOCKCHAIN_PRIORITY = {
 Osmosis: 100,
 Ethereum: 50,
 Arbitrum: 30,
 Zilliqa: 20,
 Neo: 20,
};

type Blockchain = keyof typeof BLOCKCHAIN_PRIORITY;

export interface WalletBalance {
 blockchain: Blockchain;
 currency: string;
 amount: number;
}

// filter creates a new array; sort orders it without changing the hook's array.
// Higher priority numbers appear first.
export const getSortedBalances = (balances: WalletBalance[]): WalletBalance[] =>
 balances
  .filter((balance) => balance.amount > 0)
  .sort((left, right) => {
   const leftPriority = BLOCKCHAIN_PRIORITY[left.blockchain];
   const rightPriority = BLOCKCHAIN_PRIORITY[right.blockchain];
   return rightPriority - leftPriority; // Equal priorities return 0.
  });
