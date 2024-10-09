export const ALCHEMY_API_BASE_URL =
  (process.env.NEXT_PUBLIC_ALCHEMY_API_BASE_URL as string) ||
  'https://eth-mainnet.g.alchemy.com';
export const ALCHEMY_API_KEY = process.env
  .NEXT_PUBLIC_ALCHEMY_API_KEY as string;
