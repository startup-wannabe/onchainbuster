type TCMCTokenResponse = {
  data: Record<string, TCMCTokenDetail>;
};

type TCMCTokenDetail = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  date_added: string;
  tags: string[];
  infinite_supply: boolean;
  self_reported_circulating_supply: number;
  self_reported_market_cap: number;
  tvl_ratio: any;
  last_updated: string;
  quote: { USD: TCMCUSDPrice };
};

type TCMCUSDPrice = {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  tvl: any;
  last_updated: string;
};
