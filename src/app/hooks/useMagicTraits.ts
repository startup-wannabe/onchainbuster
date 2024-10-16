import { selectState } from '@/helpers';
import {
  isDeFiOrArt,
  isDegenOrDiamondHand,
  isOriginalBuilderOrMultichainCitizen,
} from '@/helpers/trait.helper';
import { useMemo } from 'react';
import { useMagicContext } from './useMagicContext';

export const useMagicTraits = () => {
  const {
    defiActivityStats,
    chainStats,
    tokenPortfolioStats,
    nftActivityStats,
    nftPortfolioStats,
    tokenActivityStats,
    longestHoldingToken,
    dappInteractionStats,
    activityStats,
    talentPassportScore,
  } = useMagicContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const defitOrArtTraitResult = useMemo(
    () =>
      isDeFiOrArt(
        selectState(defiActivityStats),
        selectState(tokenPortfolioStats),
        selectState(nftPortfolioStats),
        selectState(dappInteractionStats),
        selectState(activityStats).firstActiveDay || new Date(),
      ),
    [
      defiActivityStats,
      tokenPortfolioStats,
      nftActivityStats,
      nftPortfolioStats,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const degenOrDiamondHandResult = useMemo(
    () =>
      isDegenOrDiamondHand(
        selectState(tokenActivityStats),
        selectState(defiActivityStats),
        selectState(longestHoldingToken),
        selectState(activityStats).firstActiveDay || new Date(),
      ),
    [
      defiActivityStats,
      tokenActivityStats,
      defiActivityStats,
      longestHoldingToken,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const originalBuilderOrMultichainCitizen = useMemo(
    () =>
      isOriginalBuilderOrMultichainCitizen(
        selectState(activityStats),
        selectState(chainStats),
        selectState(talentPassportScore),
      ),
    [
      defiActivityStats,
      tokenPortfolioStats,
      nftActivityStats,
      nftPortfolioStats,
    ],
  );

  return {
    defitOrArtTraitResult,
    degenOrDiamondHandResult,
    originalBuilderOrMultichainCitizen,
  };
};
