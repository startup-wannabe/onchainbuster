// Unified type
type TTokenSymbolDetail = {
  symbol: string;
  currentUSDPrice: number;
  tags: string[];
  date_added: string;
};
type TTokenBalance = {
  chain: string;
  name: string;
  symbol: string;
  logoURI?: string;
  tokenBalance: number; // Formatted
};

type TNFTBalance = {
  chain: string;
  collectionAddress: string;
  collectionName: string;
  collectionImage: string;
  floorPrice: number;
  totalCount: number;
  totalValue: number; // USD
};

type TTokenActivity = {
  chain: string;
  symbol: string;
  from: string; // Address
  to: string;
  value: string; // Token amount
  timestamp: string;
};

type TNFTActivity = {
  chain: string;
  action: string; // buy, sale, mint - exclude transfer,listing,bidding
  collectionName: string;
  from: string;
  to: string;

  tokenId: string;
  tokenName: string;
  tokenImage: string;

  amount: string;
  price?: string; // Value in USD
};
