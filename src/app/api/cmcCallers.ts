export const listCMCTokenDetail = async (tokenList: string) => {
  if (tokenList === '') {
    return [];
  }

  const data = await fetch(`/api/cmc?tokens=${tokenList}`, {
    method: 'GET',
  });

  const res = await data.json();
  const cmcResponse: TCMCTokenResponse = res.data;

  return Object.values(cmcResponse.data).map((token) => {
    return {
      symbol: token.symbol.toUpperCase(),
      tags: token.tags,
      date_added: token.date_added,
      currentUSDPrice: token.quote.USD.price,
    } as TTokenSymbolDetail;
  });
};
