import { BNB_METADATA, ETH_METADATA } from '@/constants/token';

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

export const getEVMScanBalance = async (address: string, chain: string) => {
  if (address === '') {
    return [];
  }

  const data = await fetch(
    `/api/evmscan/account?address=${address}&chain=${chain}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const evmResp: TEVMScanResponse = res.data;

  // Return list for easy mapping
  return [
    {
      chain: chain.toLowerCase(),
      name:
        chain.toUpperCase() === 'BSC' ? BNB_METADATA.name : ETH_METADATA.name,
      symbol:
        chain.toUpperCase() === 'BSC'
          ? BNB_METADATA.symbol
          : ETH_METADATA.symbol,
      logoURI:
        chain.toUpperCase() === 'BSC'
          ? BNB_METADATA.logoURI
          : ETH_METADATA.logoURI,
      tokenBalance: (evmResp.result as any as number) / 10 ** 18,
    } as TTokenBalance,
  ];
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

  return {
    token: token.map((t) => {
      return {
        chain: chain.toLowerCase(),
        symbol: t.tokenSymbol,
        from: t.from,
        to: t.to,
        value: t.value,
        timestamp: t.timeStamp,
      } as TTokenActivity;
    }),
    nft,
  };
};
