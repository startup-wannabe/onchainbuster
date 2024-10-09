export const listAllEVMTransactions = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB', 'BSC'];
  const results = await Promise.all([
    ...chains.map((chain) => listEtherscanTransactions(address, chain)),
    listVicTransactions(address),
  ]);

  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};

export const listEtherscanTransactions = async (
  address: string,
  chain: string,
  action = 'txlist',
) => {
  if (address === '') {
    return [];
  }

  const data = await fetch(
    `/api/explorers/etherscan?address=${address}&chain=${chain}&action=${action}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const etherscanResp: TEtherscanResponse = res.data;
  return etherscanResp.result;
};

export const listVicTransactions = async (account: string, limit = 100) => {
  if (account === '') {
    return [];
  }

  let allTransactions: TVicscanTransaction[] = [];
  let offset = 0;
  let total = 0;

  do {
    const data = await fetch(
      `/api/explorers/vicscan?account=${account}&limit=${limit}&offset=${offset}`,
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

export const searchAddressFromOneID = async (text: string) => {
  if (text === '') {
    return '';
  }

  const data = await fetch(`/api/oneid?text=${text}`, {
    method: 'GET',
  });

  const res = await data.json();
  const oneidResp: TSearchOneIDResponse = res.data[0];
  return oneidResp?.address ? oneidResp.address : '';
};
