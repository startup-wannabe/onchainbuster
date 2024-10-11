type TTokenList = {
  name: string;
  timestamp: string;
  version: Version;
  tags: Tags;
  logoURI: string;
  keywords: string[];
  tokens: TTokenListMetadata[];
};

type TTokenListMetadata = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions?: TTokenListExtensions;
};

type TTokenListExtensions = {
  bridgeInfo: Record<string, { tokenAddress: string }>;
};
