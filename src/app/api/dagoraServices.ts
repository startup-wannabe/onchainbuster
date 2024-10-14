import { DAGORA_API_BASE_URL } from '@/constants/nftInfra';

export const listDagoraAddressActivity = async (
  address: string,
  size = 1000,
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
      const query = `address=${address}&page=${page}&size=${size}&type=${type}`;

      const data = await fetch(
        `${DAGORA_API_BASE_URL}/user/profile/activity?${query}`,
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

  return activitiesArrays.flat().map((activity) => {
    return {
      chain: 'vic',
      action: ['listing', 'mint'].includes(activity.type.toLowerCase())
        ? activity.type.toLowerCase()
        : 'sale',
      collectionName: activity.collection?.title || '',
      from: activity.from,
      to: activity.to,
      tokenId: activity.id,
      tokenName: activity.name,
      tokenImage: activity.image,
      amount: activity.amount ? activity.amount.toString() : '1',
      price: activity.price.toString() || 0,
    } as TNFTActivity;
  });
};

export const listDagoraAddressBalance = async (
  address: string,
  size = 1000,
) => {
  if (address === '') {
    return [];
  }

  let accountCollections: TDagoraAccountCollection[] = [];
  let page = 1;
  let total = 0;

  do {
    const query = `page=${page}&size=${size}`;
    const data = await fetch(
      `${DAGORA_API_BASE_URL}/user/balanceV3/${address}?${query}`,
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
  const uniqueCollections = [
    ...new Set(
      accountCollections
        .filter((c) => c.isApproved)
        .map((collection) => `${collection.address}-${collection.chain}`),
    ),
  ];
  const collectionsDetails = await Promise.all(
    uniqueCollections.map(async (uniqueCollection) => {
      const [address, chain] = uniqueCollection.split('-');
      const [stats, metadata] = await Promise.all([
        getDagoraCollectionStats(address, chain),
        getDagoraCollectionMetadata(address, chain),
      ]);

      return {
        address,
        chain,
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
    `${DAGORA_API_BASE_URL}/collection/meta/stats?address=${address}&chain=${chain}`,
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
    `${DAGORA_API_BASE_URL}/collection/meta/info?address=${address}&chain=${chain}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const metadata: TDagoraCollectionMetadata = res.data.data.collection;
  return metadata;
};
