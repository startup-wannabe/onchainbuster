type IValueByChain = {
  chainName: string;
  value: number;
};

type TTokenDetails = {
  totalBalance: number;
  chains: IValueByChain[];
  name: string;
  logoURI: string;
  price: number;
  totalUSDValue: number;
  tags: string[];
  date_added: string;
  symbol: string;
};

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

type TChainRecordWithTokens = Record<
  string,
  {
    totalUSDValue: number;
    tokens: TTokenDetails[];
  }
>;

type TSymbolAggregationBalance = Record<string, TTokenDetails>;

type TTokenPortfolioStats = {
  sumPortfolioUSDValue: number;
  sumMemeUSDValue: number;
  mostValuableToken: {
    name: string;
    symbol: string;
    value: number;
    logoURI: string;
  };
  aggregatedBalanceBySymbol: TSymbolAggregationBalance;
  chainRecordsWithTokens: TChainRecordWithTokens;
  chainCircularPackingData: TCircularTree;
};

type TNFTPortfolioStats = {
  sumPortfolioUSDValue: number;
  mostValuableNFTCollection: TNFTBalance;
};

type TCircularTreeNode = {
  type: 'node';
  value: number;
  name: string;
  children: Tree[];
};

type TCircularTreeLeaf = {
  type: 'leaf';
  name: string;
  value: number;
};

type TCircularTree = TCircularTreeNode | TCircularTreeLeaf;
