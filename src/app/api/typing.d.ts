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

// Unified type
type TTokenBalance = {
  chain: string;
  name: string;
  symbol: string;
  logoURI: string;
  tokenBalance: number; // Formatted
};

type TNFTBalance = {
  chain: string;
  collectionName: string;
  floorPrice: number;
  totalCount: number;
  totalValue: number; // USD
};

type TTokenActivity = {
  chainID: number;
};
