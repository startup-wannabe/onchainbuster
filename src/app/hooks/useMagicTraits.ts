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

  const defitOrArtTraitResult = useMemo(
    () =>
      isDeFiOrArt(
        selectState(defiActivityStats),
        selectState(tokenPortfolioStats),
        selectState(nftActivityStats),
        selectState(nftPortfolioStats),
        selectState(activityStats).firstActiveDay || new Date(),
      ),
    [
      defiActivityStats,
      tokenPortfolioStats,
      nftActivityStats,
      nftPortfolioStats,
    ],
  );

  const degenOrDiamondHandResult = useMemo(
    () =>
      isDegenOrDiamondHand(
        selectState(tokenPortfolioStats),
        selectState(tokenActivityStats),
        selectState(defiActivityStats),
        selectState(longestHoldingToken),
      ),
    [
      defiActivityStats,
      tokenActivityStats,
      defiActivityStats,
      longestHoldingToken,
    ],
  );

  const originalBuilderOrMultichainCitizen = useMemo(
    () =>
      isOriginalBuilderOrMultichainCitizen(
        selectState(activityStats),
        selectState(chainStats),
        selectState(dappInteractionStats),
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
