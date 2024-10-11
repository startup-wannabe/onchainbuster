type TActivityStats = {
  totalTxs: number;
  firstActiveDay: Date | null;
  uniqueActiveDays: number;
  uniqueActiveDays12M: number;
  uniqueActiveDays6M: number;
  uniqueActiveDays3M: number;
  longestStreakDays: number;
  currentStreakDays: number;
  activityPeriod: number;
};

type TTokenPortfolioStats = {
  sumPortfolioUSDValue: number;
  mostValuableToken: {
    name: string;
    symbol: string;
    value: number;
    logoURI: string;
  };
  aggregatedBalanceBySymbol: Record<
    string,
    {
      totalBalance: number;
      chains: Set<string>;
      name: string;
      logoURI: string;
      price: number;
      totalUSDValue: number;
    }
  >;
  aggregatedBalanceByChain: Record<string, number>;
};
