type TAlchemyRequest = {
  id: number;
  jsonrpc: string;
  method: string;
  params: string[];
};

type TAlchemyResponse = {
  id: number;
  jsonrpc: string;
  result: {
    address: string;
    tokenBalances: TAlchemyTokenBalance[];
    pageKey?: string;
  };
};

type TAlchemyTokenBalance = {
  contractAddress: string;
  tokenBalance: string;
};

type TAlchemyTokenMetadata = {
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
};
