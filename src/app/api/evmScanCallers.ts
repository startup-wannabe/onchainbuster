export const listEVMScanTransactions = async (
  address: string,
  chain: string,
  action = 'txlist',
) => {
  if (address === '') {
    return [];
  }

  const data = await fetch(
    `/api/evmscan/activity?address=${address}&chain=${chain}&action=${action}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const evmResp: TEVMScanResponse = res.data;
  return evmResp.result;
};

export const listEVMScanTokenActivity = async (
  address: string,
  chain: string,
  limit = 100,
) => {
  if (address === '') {
    return {
      token: [],
      nft: [],
    };
  }

  // Ommit token1155tx
  const tokenActions = ['tokentx', 'tokennfttx'];
  let token: TEVMScanTokenActivity[] = [];
  let nft: TEVMScanTokenActivity[] = [];

  for (const action of tokenActions) {
    let offset = 0;
    let previousResultCount = 0;

    // Etherscan will always return max data when offset reach infinity -> need to compare with existing array length
    while (true) {
      const data = await fetch(
        `/api/evmscan/token?address=${address}&chain=${chain}&action=${action}&limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
        },
      );

      const res = await data.json();
      const evmScanResp: TEVMScanResponse = res.data;

      const currentResultCount = evmScanResp.result.length;

      if (action === 'tokentx') {
        token = token.concat(evmScanResp.result as TEVMScanTokenActivity[]);
      } else {
        nft = nft.concat(evmScanResp.result as TEVMScanTokenActivity[]);
      }

      if (
        currentResultCount === 0 ||
        currentResultCount === previousResultCount
      ) {
        break;
      }

      previousResultCount = currentResultCount;
      offset += limit;
    }
  }

  return { token, nft };
};
