export const DAGORA_API_BASE_URL =
  (process.env.NEXT_PUBLIC_DAGORA_API_BASE_URL as string) ||
  'https://main-server.dagora.xyz/adapters/dagora';

export const RESERVOIR_API_BASE_URL =
  (process.env.NEXT_PUBLIC_RESERVOIR_API_BASE_URL as string) ||
  'https://api.reservoir.tools/';
export const RESERVOIR_API_KEY = process.env
  .NEXT_PUBLIC_RESERVOIR_API_KEY as string;
