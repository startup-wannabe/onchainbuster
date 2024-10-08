export const getDagoraProfile = async (address: string) => {
  if (address === '') {
    return {
      balance: [],
      activities: [],
      stats: {},
    };
  }

  const [balance, activities, stats] = await Promise.all([
    listDagoraAddressActivities(address),
    listDagoraAddressBalance(address),
    getDagoraAddressStats(address),
  ]);

  return {
    balance,
    activities,
    stats,
  };
};

export const getDagoraAddressStats = async (address: string) => {
  if (address === '') {
    return '';
  }

  const data = await fetch(`/api/dagora/stats?address=${address}`, {
    method: 'GET',
  });

  const res = await data.json();
  const accountStats: TDagoraAccountStats = res.data.data.stats;
  return accountStats;
};

export const listDagoraAddressActivities = async (
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

  // Filter approved NFT (not spam) before returning
  return accountCollections.filter((c) => c.isApproved);
};
