type TTokenList = {
  name: string;
  timestamp: string;
  version: Version;
  tags: Tags;
  logoURI: string;
  keywords: string[];
  tokens: TTokenCurrency[];
};

type TTokenCurrency = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions?: TTokenExtensions;
};

type TTokenExtensions = {
  bridgeInfo: Record<string, { tokenAddress: string }>;
};
