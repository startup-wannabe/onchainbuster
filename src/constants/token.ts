type NativeTokenMetadata = {
  symbol: string;
  name: string;
  logoURI: string;
  decimals: number;
};

export const ETH_METADATA: NativeTokenMetadata = {
  symbol: 'ETH',
  name: 'Ether',
  decimals: 18,
  logoURI:
    'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
};

export const BNB_METADATA: NativeTokenMetadata = {
  symbol: 'BNB',
  name: 'BNB',
  decimals: 18,
  logoURI:
    'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png',
};

export const VIC_METADATA: NativeTokenMetadata = {
  symbol: 'VIC',
  name: 'Viction',
  decimals: 18,
  logoURI:
    'https://assets.coingecko.com/coins/images/3416/standard/viction.jpeg',
};

export const TOKEN_TAGS = [];
