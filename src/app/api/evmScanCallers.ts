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
      decimals:
        chain.toUpperCase() === 'BSC'
          ? BNB_METADATA.decimals
          : ETH_METADATA.decimals,
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
    return [];
  }

  const action = 'tokentx';
  let token: TEVMScanTokenActivity[] = [];

  let offset = 0;
  let previousResultCount = 0;

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

    // Ensure no duplicates are added to the nft array
    const uniqueResults = evmScanResp.result.filter(
      (item: any) =>
        !token.some((existingItem) => existingItem.hash === item.hash),
    );
    token = token.concat(uniqueResults as TEVMScanTokenActivity[]);

    if (
      currentResultCount === 0 ||
      currentResultCount === previousResultCount
    ) {
      break;
    }

    previousResultCount = currentResultCount;
    offset += limit;
  }

  return token.map((t) => {
    return {
      chain: chain.toLowerCase(),
      symbol: t.tokenSymbol,
      from: t.from,
      to: t.to,
      value: t.value,
      timestamp: t.timeStamp,
    } as TTokenActivity;
  });
};

export const listEVMScanNFTActivity = async (
  address: string,
  chain: string,
  limit = 100,
) => {
  if (address === '') {
    return [];
  }

  const action = 'tokennfttx';
  let nft: TEVMScanTokenActivity[] = [];

  let offset = 0;
  let previousResultCount = 0;

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

    // Ensure no duplicates are added to the nft array
    const uniqueResults = evmScanResp.result.filter(
      (item: any) =>
        !nft.some((existingItem) => existingItem.hash === item.hash),
    );
    nft = nft.concat(uniqueResults as TEVMScanTokenActivity[]);

    if (
      currentResultCount === 0 ||
      currentResultCount === previousResultCount
    ) {
      break;
    }

    previousResultCount = currentResultCount;
    offset += limit;
  }

  return nft.map((t) => {
    return {
      chain: chain.toLowerCase(),
      blockHash: t.blockHash,
      from: t.from,
      to: t.to,
      hash: t.hash,
      tokenId: t.tokenID,
      tokenName: t.tokenName,
      tokenSymbol: t.tokenSymbol,
      timestamp: t.timeStamp,
    } as TNFTActivityV2;
  });
};

export const getLatestNFTActivity = async (
  address: string,
  chain: string,
  limit = 10,
) => {
  if (address === '') {
    return [];
  }

  const action = 'tokennfttx';
  const data = await fetch(
    `/api/evmscan/latest?address=${address}&chain=${chain}&action=${action}&limit=${limit}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const evmScanResp: TEVMScanResponse = res.data;
  const nft = evmScanResp.result as TEVMScanTokenActivity[];

  return nft.map((t) => {
    return {
      chain: chain.toLowerCase(),
      blockHash: t.hash, // Sorry for bad naming
      from: t.from,
      to: t.to,
      hash: t.hash,
      tokenId: t.tokenID,
      tokenName: t.tokenName,
      tokenSymbol: t.tokenSymbol,
      timestamp: t.timeStamp,
    } as TNFTActivityV2;
  });
};
