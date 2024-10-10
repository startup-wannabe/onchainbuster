# Buildathon DEVLOG

---
## 2024-10-07
Idea initiation - multichain-scoring for personalized recommendations of product for user to have more motivation onboarding to Base
- Extension of [onchainscore.xyz](https://www.onchainscore.xyz/) and [Basename on-chain score](https://x.com/base/status/1841911856656708073), multi-aggregation, product-oriented (DeFi, GameFi, NFT, SocialFi,...) metrics

Whiteboard: [Excalidraw](https://excalidraw.com/#room=4d025e9394a150d042b9,SLby7Ri-UjHaGsRpWElsjQ)
![draft-idea](./assets/draft-idea.png)


Technical preparation:
- evm-scan data fetching ([Etherscan](https://etherscan.io/) and its sub-products on multichains): From ETH, Base, OP, BSC, ARB -> Setup API key and router
- Token & NFT Activity: [Alchemy](https://www.alchemy.com/) and [Reservoir](https://reservoir.tools/)
- Vietnamese-oriented chain: [Viction](https://www.viction.xyz/) (explorer scan) and [Dagora](https://dagora.xyz/) (NFT marketplace)

Done:
- Init repo with [OnChainKit](onchainkit.xyz)

## 2024-10-08
Done: 
- API router for data fetching (simple aggregation)
- Convert [ENS](https://dagora.xyz/) (.eth) and [OneID](https://www.oneid.xyz/) to wallet address

Define scoring metrics and UI/UX (expected insights for user)

Data collection & Resources:
- Token metadata list: [Coin98 Token List](https://rapid.coin98.com/token-list.json)
- Native Basename on-chain Stats: [Basenames/UsernameProfileSectionHeatmap](https://github.com/base-org/web/tree/master/apps/web/src/components/Basenames/UsernameProfileSectionHeatmap)

## 2024-10-10
- Fully integrate the API data sources (figure below). New sources:
  - Talent Protocol: [Passport Credentials](https://docs.talentprotocol.com/docs/talent-passport/credentials) for pre-score insights.
  - CoinmarketCap: Quotes API for latest price and tags [getV2CryptocurrencyQuotesLatest](https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest)
  - Uniswap Labs: [List Tokens](https://tokenlists.org/token-list?url=https://ipfs.io/ipns/tokens.uniswap.org) (replace previous Coin98 source)
- (Raw) union sources between native EVM and Viction. Collected data:
  - Tokens (ERC/BEP/VRC-20):
    - Activity (from/to transactions)
    - Token balance (at call time)
    - Native token (ETH, BNB, VIC) balance
  - Transactions: all raw from explorers
  - NFT:
    - Balance: collections holding at call time
    - Activity: List/Sale/Bid/Mint/Buy history
- CoinmarketCap API will be use to convert token/NFT value to one currency (USD/ETH) to perform metric calculations.

![data-processing](./assets/data-processing.png)

Data support summary
| **Sections**          | **Ethereum** | **Base** | **Optimism** | **Arbitrum** | **Viction** | **BSC** |
|-----------------------|--------------|----------|--------------|--------------|-------------|---------|
| All Transactions      |       ✅      |     ✅    |       ✅      |       ✅      |      ✅      |    ✅    |
| Native Token Balance  |       ✅      |     ✅    |       ✅      |       ✅      |      ✅      |    ✅    |
| Token Activity        |       ✅      |     ✅    |       ✅      |       ✅      |      ✅      |    ✅    |
| Token Balance         |       ✅      |     ✅    |       ✅      |       ✅      |      ✅      |    ❌    |
| NFT Activity          |       ✅      |     ✅    |       ✅      |       ✅      |      ✅      |    ✅    |
| NFT Balance           |       ✅      |     ✅    |       ✅      |       ✅      |      ✅      |    ✅    |