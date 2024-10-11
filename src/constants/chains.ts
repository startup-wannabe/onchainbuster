export const chainIDMap: Record<
  string,
  { id: number; name: string; nativeToken: string }
> = {
  eth: { id: 1, name: 'Ethereum', nativeToken: 'ETH' },
  base: { id: 8453, name: 'Base', nativeToken: 'ETH' },
  arb: { id: 42161, name: 'Arbitrum', nativeToken: 'ETH' },
  op: { id: 10, name: 'Optimism', nativeToken: 'ETH' },
  bsc: { id: 56, name: 'Binance Smart Chain', nativeToken: 'BNB' },
  vic: { id: 88, name: 'Viction', nativeToken: 'VIC' },
};
