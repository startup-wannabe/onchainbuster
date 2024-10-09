export const getAlchemyTokenBalance = async (
  address: string,
  chain: string,
) => {
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
  const alchemyResult: TAlchemyResult = res.data;
  const tokenBalance = alchemyResult.result.tokenBalances || [];
  return tokenBalance;
};
