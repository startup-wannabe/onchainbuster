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
    logoURI: '/chains/chain-eth.png',
    color: '#8198EE',
  },
  base: {
    id: 8453,
    name: 'Base',
    nativeToken: 'ETH',
    logoURI: '/chains/chain-base.webp',
    color: '#0052FF',
  },
  arb: {
    id: 42161,
    name: 'Arbitrum',
    nativeToken: 'ETH',
    logoURI: '/chains/chain-arbitrum.webp',
    color: '#12AAFF',
  },
  op: {
    id: 10,
    name: 'Optimism',
    nativeToken: 'ETH',
    logoURI: '/chains/chain-op.png',
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
    logoURI: '/chains/chain-vic.webp',
    color: '#E0DFDB',
  },
};
