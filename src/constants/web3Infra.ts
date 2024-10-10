export const ALCHEMY_API_BASE_URL =
  (process.env.NEXT_PUBLIC_ALCHEMY_API_BASE_URL as string) ||
  'https://eth-mainnet.g.alchemy.com';
export const ALCHEMY_API_KEY = process.env
  .NEXT_PUBLIC_ALCHEMY_API_KEY as string;

export const MORALIS_API_BASE_URL =
  (process.env.NEXT_PUBLIC_MORALIS_API_BASE_URL as string) ||
  'https://deep-index.moralis.io/api';
export const MORALIS_API_KEY = process.env
  .NEXT_PUBLIC_MORALIS_API_KEY as string;

export const CMC_API_BASE_URL =
  (process.env.NEXT_PUBLIC_CMC_API_BASE_URL as string) ||
  'https://pro-api.coinmarketcap.com/';
export const CMC_API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY as string;

export const TALENTPASSPORT_API_BASE_URL =
  (process.env.NEXT_PUBLIC_TALENTPASSPORT_API_BASE_URL as string) ||
  'https://api.talentprotocol.com/api/';
export const TALENTPASSPORT_API_KEY = process.env
  .NEXT_PUBLIC_TALENTPASSPORT_API_KEY as string;
