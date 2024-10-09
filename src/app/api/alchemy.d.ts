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
    tokenBalances: TTokenBalance[];
    pageKey?: string;
  };
};

type TTokenBalance = {
  contractAddress: string;
  tokenBalance: string;
};
