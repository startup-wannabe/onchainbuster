import { VIC_METADATA } from '@/constants/token';

export const listVicTransactions = async (account: string, limit = 100) => {
  if (account === '') {
    return [];
  }

  let allTransactions: TVicscanTransaction[] = [];
  let offset = 0;
  let total = 0;

  do {
    const data = await fetch(
      `/api/vicscan/activity?account=${account}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
      },
    );

    const res = await data.json();
    const vicscanResp: TVicscanResponse = res.data;
    allTransactions = allTransactions.concat(vicscanResp.data);
    total = vicscanResp.total;
    offset += limit; // Increment offset by limit for the next fetch
  } while (offset < total); // Continue until all data is fetched

  return allTransactions;
};

export const listVicAllActivity = async (account: string) => {
  if (account === '') {
    return { token: [], nft: [] };
  }

  const [tokenActivities, nftActivities] = await Promise.all([
    listVicTokenActivity(account),
    listVicNFTActivity(account),
  ]);

  return {
    token: tokenActivities,
    nft: nftActivities,
  };
};

export const listVicTokenActivity = async (account: string, limit = 100) => {
  if (account === '') {
    return [];
  }

  let tokenActivities: TVicscanTokenActivity[] = [];
  let offset = 0;
  let total = 0;

  do {
    const data = await fetch(
      `/api/vicscan/token?account=${account}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
      },
    );

    const res = await data.json();
    const vicscanResp: TVicscanResponse = res.data;
    tokenActivities = tokenActivities.concat(vicscanResp.data);
    total = vicscanResp.total;
    offset += limit; // Increment offset by limit for the next fetch
  } while (offset < total); // Continue until all data is fetched

  return tokenActivities.map((t) => {
    return {
      chain: 'vic',
      symbol: t.tokenSymbol,
      from: t.from,
      to: t.to,
      value: t.value,
      timestamp: t.timestamp.toString(),
    } as TTokenActivity;
  });
};

export const listVicNFTActivity = async (account: string, limit = 100) => {
  if (account === '') {
    return [];
  }

  let nftActivities: TVicscanNFTActivity[] = [];
  let offset = 0;
  let total = 0;

  do {
    const data = await fetch(
      `/api/vicscan/nft?account=${account}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
      },
    );

    const res = await data.json();
    const vicscanResp: TVicscanResponse = res.data;
    nftActivities = nftActivities.concat(vicscanResp.data);
    total = vicscanResp.total;
    offset += limit; // Increment offset by limit for the next fetch
  } while (offset < total); // Continue until all data is fetched

  return nftActivities;
};

export const listVicTokenBalance = async (account: string, limit = 100) => {
  if (account === '') {
    return [];
  }

  let tokenBalance: TVicscanTokenBalance[] = [];
  let offset = 0;
  let total = 0;

  do {
    const data = await fetch(
      `/api/vicscan/balance?account=${account}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
      },
    );

    const res = await data.json();
    const vicscanResp: TVicscanResponse = res.data;
    tokenBalance = tokenBalance.concat(vicscanResp.data);
    total = vicscanResp.total;
    offset += limit; // Increment offset by limit for the next fetch
  } while (offset < total); // Continue until all data is fetched

  const detailedTokenBalance = await Promise.all(
    tokenBalance.map(async (token) => {
      const metadata = await getVicTokenDetail(token.token);
      return {
        chain: 'vic',
        name: metadata.name,
        symbol: token.tokenSymbol,
        logoURI: metadata.image,
        tokenBalance: token.quantityNumber,
      } as TTokenBalance;
    }),
  );

  return detailedTokenBalance;
};

export const getVicNativeBalance = async (address: string) => {
  if (address === '') {
    return [];
  }

  const data = await fetch(`/api/vicscan/account?address=${address}`, {
    method: 'GET',
  });

  const res = await data.json();
  const vicAccount: TVicscanAccount = res.data;

  // Return list for easy mapping
  return [
    {
      chain: 'vic',
      name: VIC_METADATA.name,
      logoURI: VIC_METADATA.logoURI,
      symbol: VIC_METADATA.symbol,
      tokenBalance: vicAccount.balanceNumber, // Formatted
    } as TTokenBalance,
  ];
};

export const getVicTokenDetail = async (tokenAddress: string) => {
  if (tokenAddress === '') {
    return {} as TVicscanTokenDetail;
  }

  const data = await fetch(
    `/api/vicscan/metadata?tokenAddress=${tokenAddress}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const token: TVicscanTokenDetail = res.data;

  return token;
};

export const searchAddressFromOneID = async (text: string) => {
  if (text === '') {
    return '';
  }

  const data = await fetch(`/api/vicscan/oneid?text=${text}`, {
    method: 'GET',
  });

  const res = await data.json();
  const oneidResp: TSearchOneIDResponse = res.data[0];
  return oneidResp?.address ? oneidResp.address : '';
};
