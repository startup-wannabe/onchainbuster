## Overview

_Touch on theory, concept about personal references, trait been built on a spectrum ==> Speculate as such on a Web3 wallet to indicate the behaviors_

According to [Statista](https://www.statista.com/topics/9088/cryptocurrencies-in-vietnam/#topicOverview), Vietnam has consistently ranked among the top three globally for crypto adoption since 2021, highlighting the growing presence of cryptocurrency within local communities. Despite this, the understanding and on-chain usage among Vietnamese users are often limited to local protocols or well-known global projects.
For most on-chain users in Vietnam, primarily retail and non-tech investors, the overwhelming amount of technical documentation and overload information across ecosystem platforms makes it difficult to explore new blockchain networks independently. This creates a barrier to entry, limiting broader adoption and understanding within the community.
Thus OnchainBuster is born with a mission: **_‘How can users from other blockchains easily find Base applications that match their interests?’_**

## Findings

In the academic field, there has been a growing number of studies on individual interests and their relationship to learning and exploring new concepts ([Shannon & Richard 1997](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=9b479da552270759001211c073aedb9d193475f2), [Tai-wa et.al 2018](https://link.springer.com/article/10.1007/s40692-018-0122-0)). Research on young adults and Asian students has indicated that well-focused individual interests can serve as significant positive determinants of attention, recognition, and recall ([Krapp 1999](https://www.researchgate.net/profile/Andreas-Krapp-2/publication/233896476_Interest_learning_and_development/links/57d90dc508ae601b39b0a8df/Interest-learning-and-development.pdf), [Arikpo & Grace 2015](https://files.eric.ed.gov/fulltext/EJ1079106.pdf)).
While customer surveys are a widely used tool in marketing and customer insights, there are concerns that they only reflect the subjective opinions of an individual's conscious thoughts. Therefore, utilizing a user's on-chain data footprint can capture both conscious and subconscious behaviors, providing more accurate recommendations.

Therefore, we have theorized that **_tailored guidance and recommendations based on a user's previous onchain footprints can significantly support their process of exploring a new ecosystem, particularly Base in this case_**.

## OnchainBuster Description

Explain on the rules and theory made on the product

### Concept

We leverage the Big Five Personality Model to build the trait model for OnchainBuster. The theory suggests that personality is positively reflected in real-world behaviors in everyday life. Accordingly, we consider a wallet's onchain activity and interactions with specific protocols as indicators of its owner’s preferences. Moreover, according to Big Five advocates, people occupy different positions on each dimension of the trait factors. Therefore, OnchainBuster applies spectrum-based demonstrations to reflect individual interests, capturing the diverse references and differences of all onchain users. For example, a person can be both a DeFi enthusiast and an art collector, with varying degrees of interest in each trait.

### Rules

Based on our discussions and secondary research, we have documented the profile of an on-chain user, which includes the following traits:

- DeFi Enthusiast and Art Collector
- Degen and Diamond Hands
- Original Builder and Multichain Citizen

A specific description of each category is provided below:

| **Trait**              | **Description**                                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DeFi Enthusiast**    | The user has a great number of interactions with ERC20 tokens existing on the market and is involved in DeFi activities such as swapping, lending, staking. |
| **Art Collector**      | The user is fond of art, NFT collections and makes frequent activities on NFT marketplaces, including listing, selling, bidding.                            |
| **Degen**              | The user has high frequency trading activities and willingness to skin-in new narratives as soon as they exist.                                             |
| **Diamond Hand**       | The user is keen on fundamental analysis of onchain assets, predicting by their less frequent transactions and longer holding period.                       |
| **Original Builder**   | The user is active for only limited blockchains.                                                                                                            |
| **Multichain Citizen** | The user shows up on multiple blockchains.                                                                                                                  |

### Recommendation Computation

1. Drawing from [Basename](https://www.base.org/names) [ENS](https://ens.domains/), [OneID](https://www.oneid.xyz/), or any wallet address, we apply weighted computation to on-chain metrics that likely reflect specific traits. For example, a "degen" user would have a high percentage of memecoins in their token balance or is more likely to interact with newly created token contracts within the last 12 months.
2. After calculating the weights for each metric, we tested the formulas with a sample of 15 wallets within our network and adjusted the weights to improve the logic and accuracy of the predictions.
3. Once the wallet traits are determined, the system matches category recommendations to the most prominent trait pillar of the wallet owner. For instance, a DeFi-oriented user exhibiting "degen" behavior might be recommended to explore SocialFi on Base, which has access to the latest memecoin news and market sentiment.

### How it works

This is mainly a data-intensive aggregation product. At the current stage, there are 2 main data sources that are easy to access for building up a simple analytical playground:

- Explorers: Etherscan and its relative product on L2 or other EVM-compatible chains
- 3rd party APIs: including market data (Coingecko, Coinmarketcap), and infrastructure (Alchemy, Reservoir, Moralis,...)

TBA

### Rooms for improvements

TBA

- AM/ML if more time
- Time-tested rule
