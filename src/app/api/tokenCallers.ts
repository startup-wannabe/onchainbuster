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
