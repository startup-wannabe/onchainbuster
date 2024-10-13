import { listStaticTokenMetadata } from './tokenCallers';

export const listAlchemyTokenBalance = async (
  address: string,
  chain: string,
) => {
  // Note: let the maxCount=100 by default
  const req: TAlchemyRequest = {
    id: 1,
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    params: [address],
  };
  const data = await fetch(`/api/alchemy?chain=${chain}`, {
    method: 'POST',
    body: JSON.stringify(req),
  });

  const res = await data.json();
  const alchemyRes: TAlchemyResponse = res.data;
  const tokenBalance = alchemyRes.result.tokenBalances || [];

  const alchemyChainMapping: Record<string, string> = {
    'eth-mainnet': 'eth',
    'base-mainnet': 'base',
    'opt-mainnet': 'op',
    'arb-mainnet': 'arb',
  };

  const parsedTokenBalance = tokenBalance.map((token) => {
    const metadata = listStaticTokenMetadata(
      alchemyChainMapping[chain],
      token.contractAddress,
    );

    if (metadata) {
      return {
        chain: alchemyChainMapping[chain],
        name: metadata.name,
        symbol: metadata.symbol,
        logoURI: metadata.logoURI,
        decimals: metadata.decimals,
        tokenBalance:
          Number.parseInt(token.tokenBalance, 16) / 10 ** metadata.decimals,
      } as TTokenBalance;
    }
    return null;
  });

  // Only get token with metadata
  return parsedTokenBalance.filter((token) => token !== null);
};
