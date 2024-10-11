export const listDagoraAddressActivity = async (
  address: string,
  size = 100,
) => {
  if (address === '') {
    return [];
  }

  const actionTypes = ['purchase', 'sold', 'listing'];

  const fetchActivities = async (type: string) => {
    let allActivities: (TDagoraListingActivity | TDagoraTradingActivity)[] = [];
    let page = 1;
    let total = 0;

    do {
      const data = await fetch(
        `/api/dagora/activity?address=${address}&type=${type}&size=${size}&page=${page}`,
        {
          method: 'GET',
        },
      );

      const res = await data.json();
      const dagoraResp: TDagoraAccountActivityResponse = res.data.data;

      allActivities = allActivities.concat(dagoraResp.data);
      total = dagoraResp.total;
      page += 1;
    } while (allActivities.length < total);

    return allActivities;
  };

  const activityPromises = actionTypes.map((type) => fetchActivities(type));
  const activitiesArrays = await Promise.all(activityPromises);

  return activitiesArrays.flat();
};

export const listDagoraAddressBalance = async (address: string, size = 100) => {
  if (address === '') {
    return [];
  }

  let accountCollections: TDagoraAccountCollection[] = [];
  let page = 1;
  let total = 0;

  do {
    const data = await fetch(
      `/api/dagora/balance?address=${address}&size=${size}&page=${page}`,
      {
        method: 'GET',
      },
    );

    const res = await data.json();
    const dagoraResp: TDagoraAccountBalanceResponse = res.data.data;

    accountCollections = accountCollections.concat(dagoraResp.data);
    total = dagoraResp.total;
    page += 1;
  } while (accountCollections.length < total);

  // Fetch collection stats & metadata for each approved collection
  const collectionsDetails = await Promise.all(
    accountCollections
      // Filter approved NFT (not spam) before returning
      .filter((c) => c.isApproved)
      .map(async (collection) => {
        const [stats, metadata] = await Promise.all([
          getDagoraCollectionStats(collection.address, collection.chain),
          getDagoraCollectionMetadata(collection.address, collection.chain),
        ]);

        return {
          ...collection,
          stats,
          metadata,
        } as TDagoraCollectionFull;
      }),
  );
  const addressCountRecord: Record<string, number> = {};
  for (const collection of collectionsDetails) {
    const count = addressCountRecord[collection.address] || 0;
    addressCountRecord[collection.address] = count + 1;
  }

  return Object.entries(addressCountRecord).map(([address, count]) => {
    const collection = collectionsDetails.find(
      (collection) => collection.address === address,
    );
    return {
      chain: 'vic',
      collectionAddress: address,
      collectionName: collection ? collection.metadata.title : '',
      collectionImage: collection
        ? collection.metadata.logo
            .replace('image.png', 'logo_120x120.png')
            .replace('logo.png', 'logo_120x120.png')
        : '',
      floorPrice: collection ? collection.stats.floorPrice : 0,
      totalCount: count,
      totalValue: collection ? collection.stats.floorPrice * count : 0,
    } as TNFTBalance;
  });
};

export const getDagoraCollectionStats = async (
  address: string,
  chain: string,
) => {
  if (address === '') {
    return {
      totalVolume: 0,
      floorPrice: 0,
      items: 0,
      tokenVolume: [],
    };
  }

  const data = await fetch(
    `/api/dagora/collectionStats?address=${address}&chain=${chain}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const accountStats: TDagoraCollectionStats = res.data.data.stats;
  return accountStats;
};

export const getDagoraCollectionMetadata = async (
  address: string,
  chain: string,
) => {
  if (address === '') {
    return {} as TDagoraAccountCollection;
  }

  const data = await fetch(
    `/api/dagora/collectionMetadata?address=${address}&chain=${chain}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const metadata: TDagoraCollectionMetadata = res.data.data.collection;
  return metadata;
};

// Unused
export const getDagoraProfile = async (address: string) => {
  if (address === '') {
    return {
      balance: [],
      activities: [],
      stats: {},
    };
  }

  const [balance, activities] = await Promise.all([
    listDagoraAddressBalance(address),
    listDagoraAddressActivity(address),
  ]);

  return {
    balance,
    activities,
  };
};

export const getDagoraAddressStats = async (address: string) => {
  if (address === '') {
    return {
      collections: 0,
      floorPrice: 0,
      totalVolume: 0,
    };
  }

  const data = await fetch(`/api/dagora/stats?address=${address}`, {
    method: 'GET',
  });

  const res = await data.json();
  const accountStats: TDagoraAccountStats = res.data.data.stats;
  return accountStats;
};
