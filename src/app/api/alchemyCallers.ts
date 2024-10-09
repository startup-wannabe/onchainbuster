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
  return tokenBalance;
};
