export enum UserTrait {
  DeFi = 'DeFi Enthusiast',
  Art = 'Art Collector',
  Degen = 'Degen',
  DiamondHand = 'Diamond Hand',
  OriginalBuilder = 'Original Builder',
  MultichainCitizen = 'Multichain Citizen',
}

export enum ProductTag {
  DeFi = 'defi',
  DeFiProfessional = 'defi-professional',
  SocialFi = 'social',
  Gaming = 'gaming',
  NFT = 'nft',
  Bridge = 'bridge',
  DAO = 'dao',
}

export const getBaseTraits = (userTraits: UserTrait[]): ProductTag => {
  if (
    userTraits.includes(UserTrait.DeFi) &&
    userTraits.includes(UserTrait.Degen)
  ) {
    return ProductTag.SocialFi;
  }
  if (
    userTraits.includes(UserTrait.DeFi) &&
    userTraits.includes(UserTrait.DiamondHand)
  ) {
    return ProductTag.DeFiProfessional;
  }
  if (
    userTraits.includes(UserTrait.Art) &&
    userTraits.includes(UserTrait.Degen)
  ) {
    return ProductTag.Gaming;
  }
  if (
    userTraits.includes(UserTrait.Art) &&
    userTraits.includes(UserTrait.DiamondHand)
  ) {
    return ProductTag.NFT;
  }
  if (
    userTraits.includes(UserTrait.DeFi) &&
    userTraits.includes(UserTrait.OriginalBuilder)
  ) {
    return ProductTag.Bridge;
  }
  if (
    userTraits.includes(UserTrait.DeFi) &&
    userTraits.includes(UserTrait.MultichainCitizen)
  ) {
    return ProductTag.DeFi;
  }
  if (
    userTraits.includes(UserTrait.Art) &&
    userTraits.includes(UserTrait.OriginalBuilder)
  ) {
    return ProductTag.DAO;
  }
  if (
    userTraits.includes(UserTrait.Art) &&
    userTraits.includes(UserTrait.MultichainCitizen)
  ) {
    return ProductTag.DAO;
  }

  return ProductTag.NFT; // mint.fun is Based!
};

export const isDeFiOrArt = (
  defiActivityStats: TDeFiActivityStats,
  tokenPortfolio: TTokenPortfolioStats,
  nftActivityStats: TNFTActivityStats,
  nftPortfolio: TNFTPortfolioStats,
  firstTransactionDate: Date,
): TUserTraitResult => {
  const tokenPortfolioValue = tokenPortfolio.sumPortfolioUSDValue;
  const nftPortfolioValue = nftPortfolio.sumPortfolioUSDValue;
  const totalPortfolioValue = tokenPortfolioValue + nftPortfolioValue;

  const mostTokenValue = tokenPortfolio.mostValuableToken.value;
  const mostNftValue = nftPortfolio.mostValuableNFTCollection?.totalValue || 0;

  const defiLendCount = defiActivityStats.lendCount;
  const defiSwapCount = defiActivityStats.swapCount;
  const nftTradeCount = nftActivityStats.tradeCount;

  const allTradingCount = defiSwapCount + nftTradeCount;

  const score =
    // 45% * (sum of $Token / sum of ($Token + $NFT))
    0.45 *
      (totalPortfolioValue === 0
        ? totalPortfolioValue
        : tokenPortfolioValue / totalPortfolioValue) +
    // 10% * (if topValueAsset is NFT then 1 else 0)
    0.1 * (mostTokenValue > mostNftValue ? 1 : 0) +
    // 35% * (lendCount Token / (swapCount Token + tradeCount NFT) )
    0.35 *
      (defiLendCount > allTradingCount
        ? 1
        : allTradingCount === 0
          ? 0
          : defiLendCount / allTradingCount) +
    // 10% * (if 1st_transaction < 2020 then 1 else 0)
    0.1 * (firstTransactionDate.getFullYear() < 2020 ? 1 : 0);

  // DeFi Enthusiast if >50% else Art Collector
  return { score, trait: score > 0.5 ? UserTrait.DeFi : UserTrait.Art };
};

export const isDegenOrDiamondHand = (
  tokenPortfolio: TTokenPortfolioStats,
  tokenActivityStats: TTokenActivityStats,
  defiActivityStats: TDeFiActivityStats,
  longestHoldingToken: TLongestHoldingToken,
): TUserTraitResult => {
  const memePortfolioValue = tokenPortfolio.sumMemeUSDValue;
  const tokenPortfolioValue = tokenPortfolio.sumPortfolioUSDValue;

  const defiDexCount = defiActivityStats.dexCount;
  const defiSwapCount = defiActivityStats.swapCount;

  const newTokenCount = tokenActivityStats.newCount;
  const sumTokenCount = tokenActivityStats.sumCount;

  const score =
    // 15% * (sum of $MemeToken / sum of $Token)
    0.15 *
      (tokenPortfolioValue === 0
        ? tokenPortfolioValue
        : memePortfolioValue / tokenPortfolioValue) +
    // 25% * (swapCount / dexCount)
    0.25 * (defiDexCount === 0 ? defiDexCount : defiSwapCount / defiDexCount) +
    // 35% * (newCount Token / sumCount Token )
    0.35 *
      (sumTokenCount === 0 ? sumTokenCount : newTokenCount / sumTokenCount) +
    // 25% * (longest holding token is > 12 months)
    0.25 *
      (Math.floor(longestHoldingToken.duration / (3600 * 24 * 365)) > 1 // 1 year
        ? 0
        : 1);

  // Degen (interact with new stuffs) if >50% else long-term Holder
  return {
    score,
    trait: score > 0.5 ? UserTrait.Degen : UserTrait.DiamondHand,
  };
};

export const isOriginalBuilderOrMultichainCitizen = (
  activityStats: TActivityStats,
  chainStats: TChainStats,
  dappInteractionStats: TDAppInteractionMap,
  talentPassportScore: TTalentPassportScore,
): TUserTraitResult => {
  // Degen (interact with new stuffs) or long-term Holders?
  const noActivityChains = chainStats.noActivityChains.length;
  const totalChains = chainStats.totalChains.length;

  const uniqueActiveDaysAll = activityStats.uniqueActiveDays;
  const countUniqueDaysActiveChain = chainStats.countUniqueDaysActiveChain;

  const bridgeCount = Object.values(dappInteractionStats.bridge).reduce(
    (total, { count }) => total + count,
    0,
  );

  const skillsScore = talentPassportScore.skills_score;

  // 35% * (noActivityChains / totalChains)
  // 30% * (swapCount DeFi / swapCount + lpCount is NFT then 1 else 0)
  // 25% * (lendCount Token / (sumCount NFT + swapCount Token) )
  // 10% * (if 1st_transaction < 2020 then 1 else 0)

  const score =
    // 35% * (noActivityChains / totalChains)
    0.35 * (totalChains === 0 ? totalChains : noActivityChains / totalChains) +
    0.3 *
      // 30% * (countUniqueDaysActiveChain / uniqueActiveDaysAll)
      (uniqueActiveDaysAll === 0
        ? uniqueActiveDaysAll
        : countUniqueDaysActiveChain / uniqueActiveDaysAll) +
    // 25% * (if bridgeCount < 3 then 1 else 0)
    0.25 * (bridgeCount < 3 ? 1 : 0) +
    // 10% * (if skillsScore != 0 then 1 else 0)
    0.1 * (skillsScore !== 0 ? 1 : 0);

  // Chain-dedicated builder (rather stay & build on 1 chain) if >50% else Multi-chain user
  return {
    trait:
      score > 0.5 ? UserTrait.OriginalBuilder : UserTrait.MultichainCitizen,
    score,
  };
};
