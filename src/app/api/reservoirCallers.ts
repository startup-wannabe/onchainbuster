export const getReservoirAddressProfile = async (
  address: string,
  chain: string,
) => {
  if (address === '') {
    return {
      balance: [],
      activities: [],
    };
  }

  const [balance, activities] = await Promise.all([
    listReservoirAddressBalance(address, chain),
    listReservoirAddressActivity(address, chain),
  ]);

  return {
    balance,
    activities,
  };
};

export const listReservoirAddressActivity = async (
  address: string,
  chain: string,
  limit = 20,
) => {
  if (address === '') {
    return [];
  }

  let allActivities: TReservoirNFTActivity[] = [];
  let continuation = '';

  do {
    const data = await fetch(
      `/api/reservoir/activity?chain=${chain}&address=${address}&limit=${limit}&continuation=${continuation}`,
      {
        method: 'GET',
      },
    );

    const res = await data.json();
    const result: TReservoirNFTActivityResponse = res.data;
    allActivities = allActivities.concat(result.activities);

    continuation = result.continuation || '';
  } while (continuation !== ''); // Continue until all data is fetched

  return allActivities;
};

export const listReservoirAddressBalance = async (
  address: string,
  chain: string,
  limit = 100,
) => {
  if (address === '') {
    return [];
  }

  let allCollections: TReservoirNFTCollectionEntity[] = [];
  let offset = 0;

  while (true) {
    const data = await fetch(
      `/api/reservoir/balance?chain=${chain}&address=${address}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
      },
    );

    const res = await data.json();
    const result: TReservoirNFTCollectionResponse = res.data;
    const newCollections = result.collections;
    allCollections = allCollections.concat(result.collections);
    if (newCollections.length < limit) {
      break; // Last page reached
    }

    offset += limit;
  }

  return allCollections;
};
