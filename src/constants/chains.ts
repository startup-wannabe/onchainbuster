export const chainIDMap: Record<
  string,
  { id: number; name: string; nativeToken: string; logoURI: string }
> = {
  eth: {
    id: 1,
    name: 'Ethereum',
    nativeToken: 'ETH',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  },
  base: {
    id: 8453,
    name: 'Base',
    nativeToken: 'ETH',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  },
  arb: {
    id: 42161,
    name: 'Arbitrum',
    nativeToken: 'ETH',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  },
  op: {
    id: 10,
    name: 'Optimism',
    nativeToken: 'ETH',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
  },
  bsc: {
    id: 56,
    name: 'Binance Smart Chain',
    nativeToken: 'BNB',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
  },
  vic: {
    id: 88,
    name: 'Viction',
    nativeToken: 'VIC',
    logoURI: 'https://icons.llamao.fi/icons/chains/rsz_tomochain.jpg',
  },
};
