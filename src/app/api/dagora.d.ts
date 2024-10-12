// NFT Activities
// Dagora
// --- Account Stats ---
type TDagoraAccountStats = {
  collections: number;
  floorPrice: number;
  totalVolume: number;
};

type TDagoraCollectionStats = {
  totalVolume: number;
  floorPrice: number;
  items: number;
  tokenVolume: TDagoraListingToken[];
};

type TDagoraCollectionMetadata = {
  title: string;
  symbol: string;
  baseURI: string;
  address: string;
  chain: string;
  logo: string;
  image: string;
  exploreImage: string;
  description: string;
  royaltyFee: number;
  owner: string;
  status: string;
  ownerInfo: any;
};

type TDagoraAccountBalanceResponse = {
  total: number;
  data: TDagoraAccountCollection[];
  totalPage: number;
  currPage: number;
};

type TDagoraAccountActivityResponse = {
  total: number;
  data: TDagoraTradingActivity[] | TDagoraListingActivity[];
  totalPage: number;
  currPage: number;
};

type TDagoraCollectionFull = TDagoraAccountCollection & {
  stats: TDagoraCollectionStats;
  metadata: TDagoraCollectionMetadata;
};

type TDagoraAccountCollection = {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  listingData: TDagoraListingActivity | {};
  address: string;
  chain: string;
  id: string;
  contractName: string;
  blockTime: number;
  isApproved: boolean;
  name?: string;
  image?: string;
};

// --- Activity ---
type TDagoraTradingActivity = {
  type: string;
  name: string;
  address: string;
  id: string;
  hash: string;
  chain: string;
  image: string;
  collection?: TDagoraActivityCollection;
  contractNumber?: string;
  purchaseBy: string | TDagoraUser;
  from: string | TDagoraUser;
  amount: number;
  tokenAddress: string;
  price: number;
  time: string;
  to?: string;
};

type TDagoraActivityCollection = {
  title: string;
  address: string;
  chain: string;
  logo: string;
  description: string;
  isSupportURI: boolean;
  status: string;
};

type TDagoraUser = {
  primaryName: string;
  name: string;
  userName: string;
  image: string;
  id: string;
};

type TDagoraListingActivity = {
  collection: TDagoraActivityCollection;
  type: string;
  name: string;
  image: string;
  price: number;
  expireAt: number;
  attributes: TDagoraListingAttribute[];
  tokens: TDagoraListingToken[];
  signature: string;
  signMessage: string;
  chain: string;
  address: string;
  id: string;
  from: string;
  time: number;
  duration: number;
  nonce: number;
  isMinter: number;
  tokenPrice: string;
  to?: string;
  amount?: number;
};

type TDagoraListingAttribute = {
  value: string;
  trait_type: string;
};

type TDagoraListingToken = {
  address: string;
  amount: string;
};
