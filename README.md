# 👀 🔍 OnchainBuster

A persona builder to support **multichain users** starting the next journey on Base shaped by their past onchain activities.

Play with it live on https://onchainbuster.vercel.app/

Made with ❤️️ and ☕ from 🇻🇳

## 💼 Product Overview

TBA: Main points go hereeee

Please find our detailed product description in the [docs](./docs/) folder.

## 🛠️ Local Development

This repo can be clone and run locally for any playground analytical purpose.

### 🔑 API Keys

To ensure all components work seamlessly, set the following environment variables in your `.env` file using `.env.local.example` as a reference. Here's the summary

- **Explorers APIs**: Daily limit is refreshed everyday - hardly reach the limit
  - Etherscan: https://etherscan.io/apis
  - Basescan: https://basescan.org/apis
  - OP Mainnet Etherscan: https://optimistic.etherscan.io/apis
  - Arbiscan: https://arbiscan.io/apis
- **Coinbase CDP**: [Coinbase Developer Portal's API Access](https://portal.cdp.coinbase.com/access/api). If you don't have an account, you will need to create one.
  - OnchainKit: the generated key ID for `NEXT_PUBLIC_CDP_API_KEY`
  - CDP SDK: content in the downloaded JSON file for `CDP_API_KEY_NAME` and `CDP_API_KEY_PRIVATE_KEY`
- **3rd-party API services** (All is free-plan):
  - Alchemy API: https://docs.alchemy.com/reference/api-overview
  - Reservoir API: https://docs.reservoir.tools/reference/dashboard-sign-up
  - CoinmarketCap: https://coinmarketcap.com/api
  - Talent Passport: This require submitting an application form to Talent Protocol team for [Talent API](https://docs.talentprotocol.com/docs/developers/talent-api). If you don't have this, the score using for TalentPassport is 0 by default.
  - Pinata: https://docs.pinata.cloud/frameworks/next-js
  - Moralis (unused because of the low limit in free plan): https://docs.moralis.com/web3-data-api/evm/get-your-api-key

```sh
# ~~~
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=

# See https://portal.cdp.coinbase.com/access/api
NEXT_PUBLIC_CDP_API_KEY="GET_FROM_COINBASE_DEVELOPER_PLATFORM"
CDP_API_KEY_NAME=""
CDP_API_KEY_PRIVATE_KEY=""

# Generated wallet from CDP-SDK. You might want to capture the JSON seed
WALLET_DATA={}

# ~~~
NEXT_PUBLIC_ENVIRONMENT=localhost

# See https://cloud.walletconnect.com/
NEXT_PUBLIC_WC_PROJECT_ID="GET_FROM_WALLET_CONNECT"

# ~~~ API Keys
# Blockchain-explorer APIs
NEXT_PUBLIC_ETHERSCAN_API_BASE_URL="https://api.etherscan.io/api"
NEXT_PUBLIC_ETHERSCAN_API_KEY=

NEXT_PUBLIC_BASESCAN_API_BASE_URL="https://api.basescan.org/api"
NEXT_PUBLIC_BASESCAN_API_KEY=

NEXT_PUBLIC_OPTIMISMSCAN_API_BASE_URL="https://api-optimistic.etherscan.io/api"
NEXT_PUBLIC_OPTIMISMSCAN_API_KEY=

NEXT_PUBLIC_BSCSCAN_API_BASE_URL="https://api.bscscan.com/api"
NEXT_PUBLIC_BSCSCAN_API_KEY=

NEXT_PUBLIC_ARBSCAN_API_BASE_URL="https://api.arbiscan.io/api"
NEXT_PUBLIC_ARBSCAN_API_KEY=

# ~~~ Viction ecosystem: Explorer and NFT marketplace
NEXT_PUBLIC_VICSCAN_API_BASE_URL="https://www.vicscan.xyz/api"
NEXT_PUBLIC_DAGORA_API_BASE_URL="https://main-server.dagora.xyz/adapters/dagora"

# ~~~  3rd-party APIs
NEXT_PUBLIC_RESERVOIR_API_BASE_URL="https://api.reservoir.tools"
NEXT_PUBLIC_RESERVOIR_API_KEY=

NEXT_PUBLIC_MORALIS_API_BASE_URL="https://deep-index.moralis.io/api"
NEXT_PUBLIC_MORALIS_API_KEY=

NEXT_PUBLIC_ALCHEMY_API_BASE_URL="https://eth-mainnet.g.alchemy.com"
NEXT_PUBLIC_ALCHEMY_API_KEY=

NEXT_PUBLIC_CMC_API_BASE_URL="https://pro-api.coinmarketcap.com"
NEXT_PUBLIC_CMC_API_KEY=

NEXT_PUBLIC_TALENTPASSPORT_API_BASE_URL="https://api.talentprotocol.com/api"
NEXT_PUBLIC_TALENTPASSPORT_API_KEY=

# Pinata (IPFS for NFT metadata storage)
PINATA_JWT=
```

### 💻 Getting Started

```sh
# Install bun in case you don't have it
curl -fsSL https://bun.sh/install | bash

# Install packages
bun i

# Run Next app
bun run dev
```

Keep in mind that the starter template use [Biome](https://biomejs.dev/) for linter (instead of Prettier). You might encounter some CI/CD failures due to lint & format check.

### 📚 Resources

Technical:

- UI: [OnchainKit documentation](https://onchainkit.xyz)
- CDP SDK: [CDP SDK Sample Applications](https://github.com/coinbase/cdp-sdk-sample-apps)
- Pinata: [NFT Smart Contract deployment](https://github.com/PinataCloud/foundry-pinata-minting-template) and [NextJS Viem Integration](https://github.com/PinataCloud/viem-pinata-minting-template)

## 🪪 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏗️ Builder Contacts

- 👷‍♀️ Ngan Nguyen [@thiewnngan](https://x.com/thiewnngan)
- 👷 Minh Pham [@pcminh0505](https://x.com/pcminh0505)
- 👷‍♂️ Tin Chung [@chungquantin](https://x.com/chungquantin)
