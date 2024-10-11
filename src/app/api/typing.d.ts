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
  chainID: number;
};
