// !IMPORTANT: Free plan of Moralis is not suitable for public usage
// 1 multi-chain query costs 500 CU while the daily limit is 40k
// -> only 80 calls per day
export const listMoralisTokenBalanceNative = async (
  address: string,
  chain: string,
  limit = 100,
) => {
  if (address === '') {
    return [];
  }

  let tokenBalances: TMoralisTokenBalance[] = [];
  let cursor = '';

  do {
    const data = await fetch(
      `/api/moralis/balance?chain=${chain}&address=${address}&limit=${limit}&cursor=${cursor}`,
      {
        method: 'GET',
      },
    );

    const res = await data.json();
    const moralisResp: TMoralisTokenBalanceResponse = res.data;
    tokenBalances = tokenBalances.concat(moralisResp.result);

    cursor = moralisResp.cursor || '';
  } while (cursor !== ''); // Continue until all data is fetched

  return tokenBalances;
};

export const listMoralisTokenBalance = async (
  address: string,
  chain: string,
) => {
  if (address === '') {
    return [];
  }

  const data = await fetch(
    `/api/moralis/token?chain=${chain}&address=${address}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const tokenBalance: TMoralisToken[] = res.data;
  return tokenBalance.filter(
    (token) => token.verified_contract && !token.possible_spam,
  );
};
