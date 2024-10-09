type TAlchemyRequest = {
  id: number;
  jsonrpc: string;
  method: string;
  params: (AssetTransferParams | string)[];
};

type TAlchemyResult = {
  id: number;
  jsonrpc: string;
  result: {
    address?: string;
    tokenBalances?: TTokenBalance[];
    transfers?: TAssetTransfer[];
  };
};

type TAssetTransferParams = {
  fromBlock: string;
  toBlock: string;
  toAddress: string;
  order: string;
  withMetadata: boolean;
  excludeZeroValue: boolean;
  maxCount: string;
  category: string[];
};

type TTokenBalance = {
  contractAddress: string;
  tokenBalance: string;
};

type TAssetTransfer = {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value?: number;
  erc721TokenId?: string;
  erc1155Metadata: any;
  tokenId?: string;
  asset: string;
  category: string;
  rawContract: TRawContract;
  metadata: { blockTimestamp: string };
};

type TRawContract = {
  value?: string;
  address?: string;
  decimal?: string;
};
