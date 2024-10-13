type DappMetadata = {
  name: string;
  logoURI: string;
};
export const supportedDappMetadata: Record<string, DappMetadata> = {
  // Relay bridge
  relay: {
    name: 'Relay Bridge',
    logoURI: '/image/dapps/relay.png',
  },
  // Defi
  uni: {
    name: 'Uniswap',
    logoURI: '/image/dapps/uniswap.png',
  },
  oneinch: {
    name: '1INCH',
    logoURI: '/image/dapps/1inch.png',
  },
  curve: {
    name: 'Curve',
    logoURI: '/image/dapps/curve.png',
  },
  aave: {
    name: 'Aave',
    logoURI: '/image/partners/aave.png',
  },
  pendle: {
    name: 'Pendle Finance',
    logoURI: '/image/dapps/pendle.png',
  },
  cow: {
    name: 'CoW Swap',
    logoURI: '/image/dapps/cow.png',
  },
  moonwell: {
    name: 'MoonWell',
    logoURI: '/image/partners/moonwell.webp',
  },
  aero: {
    name: 'Aerodrome',
    logoURI: '/image/partners/aerodrome.png',
  },
  velo: {
    name: 'MoonWell',
    logoURI: '/image/dapps/velodrome.png',
  },
  // NFT Marketplace
  dagora: {
    name: 'Dagora',
    logoURI: '/image/dapps/dagora.png',
  },
  opensea: {
    name: 'OpenSea',
    logoURI: '/image/partners/opensea.webp',
  },
  blur: {
    name: 'Blur',
    logoURI: '/image/dapps/blur.png',
  },
  magicEden: {
    name: 'Magic Eden',
    logoURI: '/image/partners/magiceden.webp',
  },
};
