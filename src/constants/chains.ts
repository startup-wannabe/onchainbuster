export const chainIDMap: Record<
  string,
  {
    id: number;
    name: string;
    nativeToken: string;
    logoURI: string;
    color: string;
  }
> = {
  eth: {
    id: 1,
    name: 'Ethereum',
    nativeToken: 'ETH',
    logoURI:
      'https://w7.pngwing.com/pngs/715/916/png-transparent-ethereum%EF%BC%8Ceth%EF%BC%8Cicon.png',
    color: '#8198EE',
  },
  base: {
    id: 8453,
    name: 'Base',
    nativeToken: 'ETH',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
    color: '#0052FF',
  },
  arb: {
    id: 42161,
    name: 'Arbitrum',
    nativeToken: 'ETH',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
    color: '#12AAFF',
  },
  op: {
    id: 10,
    name: 'Optimism',
    nativeToken: 'ETH',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
    color: '#FF0420',
  },
  bsc: {
    id: 56,
    name: 'Binance Smart Chain',
    nativeToken: 'BNB',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
    color: '#F0B90B',
  },
  vic: {
    id: 88,
    name: 'Viction',
    nativeToken: 'VIC',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_tomochain.jpg',
    color: '#E0DFDB',
  },
};
