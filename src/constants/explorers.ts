export const ETHERSCAN_API_BASE_URL =
  (process.env.NEXT_PUBLIC_ETHERSCAN_API_BASE_URL as string) ||
  'https://api.etherscan.io/api';
export const ETHERSCAN_API_KEY = process.env
  .NEXT_PUBLIC_ETHERSCAN_API_KEY as string;

export const BASESCAN_API_BASE_URL =
  (process.env.NEXT_PUBLIC_BASESCAN_API_BASE_URL as string) ||
  'https://api.basescan.org/api';
export const BASESCAN_API_KEY = process.env
  .NEXT_PUBLIC_BASESCAN_API_KEY as string;

export const OPTIMISMSCAN_API_BASE_URL =
  (process.env.NEXT_PUBLIC_OPTIMISMSCAN_API_BASE_URL as string) ||
  'https://api-optimistic.etherscan.io/api';
export const OPTIMISMSCAN_API_KEY = process.env
  .NEXT_PUBLIC_OPTIMISMSCAN_API_KEY as string;

export const ARBSCAN_API_BASE_URL =
  (process.env.NEXT_PUBLIC_ARBSCAN_API_BASE_URL as string) ||
  'https://api.bscscan.com/api';
export const ARBSCAN_API_KEY = process.env
  .NEXT_PUBLIC_ARBSCAN_API_KEY as string;

export const BSCSCAN_API_BASE_URL =
  (process.env.NEXT_PUBLIC_BSCSCAN_API_BASE_URL as string) ||
  'https://api.arbiscan.io/api';
export const BSCSCAN_API_KEY = process.env
  .NEXT_PUBLIC_BSCSCAN_API_KEY as string;

export const VICSCAN_API_BASE_URL =
  (process.env.NEXT_PUBLIC_VICSCAN_API_BASE_URL as string) ||
  'https://www.vicscan.xyz/api';
