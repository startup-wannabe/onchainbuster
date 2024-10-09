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
