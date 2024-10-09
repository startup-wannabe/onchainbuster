export const listAllNFTProfile = async (address: string) => {
  if (address === '') {
    return {
      eth: { balance: [], activities: [] },
      base: { balance: [], activities: [] },
      op: { balance: [], activities: [] },
      arb: { balance: [], activities: [] },
      bsc: { balance: [], activities: [] },
    };
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB', 'BSC'] as const;
  const results = await Promise.all(
    chains.map(async (chain) => ({
      balance: await listReservoirAddressBalance(address, chain),
      activities: await listReservoirAddressActivities(address, chain),
    })),
  );

  return {
    eth: results[0],
    base: results[1],
    op: results[2],
    arb: results[3],
    bsc: results[4],
  };
};

export const listReservoirAddressActivities = async (
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
