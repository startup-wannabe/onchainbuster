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
