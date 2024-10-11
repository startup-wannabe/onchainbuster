type TVicscanResponse = {
  data: any[];
  total: number;
};

type TVicscanTransaction = {
  hash: string;
  nonce: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string;
  value: string;
  gas: number;
  gasUsed: number;
  gasPrice: number | string;
  input: string;
  contractAddress: string | null;
  status: string;
  fee: number;
  timestamp: number;
  toContract: boolean;
  method: string;
  fromName?: string;
  fromOneId?: boolean;
  toName?: string;
  toOneId?: boolean;
};

type TVicscanTokenActivity = {
  logId: string;
  address: string;
  tokenType: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenName: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  value: string;
  valueNumber: number;
  timestamp: number;
  toName: string;
  fromContract: boolean;
  toContract: boolean;
  toOneId: boolean;
  thisAccount: string;
};

type TVicscanTokenBalance = {
  address: string;
  token: string;
  quantity: string;
  tokenDecimals: string;
  updatedAtBlockHash: string;
  quantityNumber: number;
  tokenSymbol: string;
  tokenName: string;
  tokenType: string;
  priceUsd: number;
  valueUsd: number;
};

type TVicscanAccount = {
  balanceNumber: number;
  code: string;
  isContract: boolean;
  status: boolean;
  isToken: boolean;
  txCount: number;
  minedBlock: number;
  rewardCount: number;
  address: string;
  balance: string;
  timestamp: number;
  updatedAt: string;
  tomoPrice: number;
  accountName: string;
  oneId: boolean;
};

type TVicscanTokenDetail = {
  status: boolean;
  marketcap: number;
  contractVerified: boolean;
  projectVerified: boolean;
  address: string;
  circulatingSupply: string;
  circulatingSupplyNumber: number;
  decimals: number;
  isMintable: boolean;
  name: string;
  owner: string;
  symbol: string;
  timestamp: number;
  totalSupply: string;
  totalSupplyNumber: number;
  type: string;
  transferCount: number;
  coingeckoId: string;
  price: number;
  priceChange: number;
  priceChangePercentage: number;
  volume: number;
  holder: number;
  image: string;
};

type TSearchOneIDResponse = {
  address: string;
  oneId: string;
};
