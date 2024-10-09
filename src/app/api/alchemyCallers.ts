export const getAlchemyTokenBalance = async (
  req: TAlchemyRequest,
  chain: string,
) => {
  const data = await fetch(`/api/alchemy?chain=${chain}`, {
    method: 'POST',
    body: JSON.stringify(req),
  });

  const res = await data.json();
  const result: TAlchemyResult = res.data.result;
  const tokenBalances = result.result.tokenBalances || [];
  return tokenBalances;
};

export const getAlchemyAssetTransfer = async (
  req: TAlchemyRequest,
  chain: string,
) => {
  const data = await fetch(`/api/alchemy?chain=${chain}`, {
    method: 'POST',
    body: JSON.stringify(req),
  });

  const res = await data.json();
  const result: TAlchemyResult = res.data.result;
  const assetTransfers = result.result.transfers || [];
  return assetTransfers;
};
