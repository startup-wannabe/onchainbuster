// Explorers
type TEtherscanResponse = {
  status: string;
  message: string;
  result: TEtherscanTransaction[];
};

type TEtherscanTransaction = {
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  methodId: string;
  functionName: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  txreceipt_status: string;
  gasUsed: string;
  confirmations: string;
  isError: string;
};

type TVicscanResponse = {
  data: TVicscanTransaction[];
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
  gasPrice: string;
  input: string;
  contractAddress: string | null;
  status: string;
  fee: number;
  timestamp: number;
  toContract: boolean;
  method: string;
  fromName: string;
  fromOneId: boolean;
  toName?: string;
  toOneId?: boolean;
};

type TSearchOneIDResponse = {
  address: string;
  oneId: string;
};
