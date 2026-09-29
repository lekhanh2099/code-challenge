# Problem 3: Messy React

The task is to review the supplied `WalletPage` snippet and propose a clearer version. [`WalletPage.issue.tsx`](./WalletPage.issue.tsx) keeps the original logic with comments at the relevant lines; [`WalletPage.refactored.tsx`](./WalletPage.refactored.tsx) shows the proposed changes.

## Issues and fixes

1. **The balance type is incomplete.** The code reads `balance.blockchain`, but `WalletBalance` does not declare it. `getPriority(blockchain: any)` also loses type checking. The refactor adds `blockchain` to the balance type and derives its supported values from the priority map.

2. **The filter cannot work as written.** It calculates `balancePriority` but checks `lhsPriority`, which is undefined in that scope. It also keeps `amount <= 0`; that looks wrong for a displayed wallet balance, but the task does not state the intended rule. The refactor **assumes** only positive balances should appear and filters with `amount > 0`.

3. **Formatting is calculated but not used.** `formattedBalances` is created, then rows are built from `sortedBalances`. Calling each row item `FormattedWalletBalance` in a callback does not add a `formatted` property at runtime. The refactor removes the unused array and formats each amount when rendering its row.

4. **The sort comparator misses ties.** It returns `-1` or `1`, but nothing when priorities match; `Neo` and `Zilliqa` both have priority 20. The refactor returns `rightPriority - leftPriority`, which returns `0` for equal priorities and puts higher priorities first.

5. **The memo repeats work on price changes.** Filtering and sorting read `balances`, not `prices`, so `prices` should not be in that `useMemo` dependency list. `getPriority` is also a pure function recreated on every render; the refactor keeps one priority map outside the component. This is a small readability improvement, not a major speed gain.

6. **Row identity and children are mishandled.** `key={index}` can identify a different balance after filtering or sorting, and the destructured `children` are never rendered. The refactor uses `blockchain:currency` as a key and renders the children. That key is valid only if the pair is unique.

The `-99` default priority is a magic value shared with the filter, and repeated callback type annotations add noise. These are smaller maintainability concerns. Mapping rows outside JSX is not itself a bug; neither is sorting after `filter`, because `filter` already creates a new array.

## How the refactor works

[`wallet-balances.ts`](./wallet-balances.ts) filters positive balances and sorts the new array by priority. `filter` is linear and `sort` is `O(n log n)`; removing the extra formatting pass makes the flow simpler but does not change the sorting cost. [`WalletPage.refactored.tsx`](./WalletPage.refactored.tsx) renders the sorted rows, calculates USD values, and passes each formatted amount to `WalletRow`.

[`wallet-balances.test.ts`](./wallet-balances.test.ts) checks filtering, priority order, equal-priority order, and that the input array is unchanged. These tests cover list logic, not React rendering.

## Assumptions to confirm

- The hooks provide balances from the five supported blockchains and usable prices. A missing price can make `usdValue` become `NaN`; the real app needs a defined behavior for that case.
- `amount.toFixed()` keeps the original zero-decimal display. The task does not define token precision.
- The snippet omits the real hooks, `BoxProps`, `WalletRow`, and styles. The refactored component remains an illustrative example with `@ts-nocheck`, not a typechecked, runnable page.
