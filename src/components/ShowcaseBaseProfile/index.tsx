import { useMagic } from '@/app/hooks/useMagic';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { useMagicTraits } from '@/app/hooks/useMagicTraits';
import { ThreeStageState } from '@/app/state.type';
import { supportedDappMetadata } from '@/constants/dapps';
import { selectState } from '@/helpers';
import { formatDuration } from '@/helpers/activity.helper';
import { formatNumberUSD } from '@/helpers/portfolio.helper';
import { UserTrait } from '@/helpers/trait.helper';
import { Box, Separator, Spinner } from '@radix-ui/themes';
import Image from 'next/image';
import { useMemo } from 'react';
import ActivityStats from '../ActivityStats';
import AnimatedComponent from '../AnimatedComponent';
import HowBasedAreYouHeader from '../HowBasedAreYouHeader';
import LoadableContainer from '../LoadableContainer';
import MultiAssetsPortfolio from '../MultiAssetsPortfolio';
import ProfileCard from '../ProfileCard';
import ProgressBar from '../ProgressBar';
import StatisticsCard from '../StatisticsCard';

type Props = {
  addressInput: string;
};

const ShowcaseBaseProfile = ({ addressInput }: Props) => {
  const {
    query: { stateCheck },
  } = useMagic();
  const {
    allTransactions,
    activityStats,
    chainStats,
    tokenPortfolio,
    dappInteractionStats,
    defiActivityStats,
    tokenPortfolioStats,
    longestHoldingToken,
    nftPortfolioStats,
    nftPortfolio,
  } = useMagicContext();
  const {
    defitOrArtTraitResult,
    degenOrDiamondHandResult,
    originalBuilderOrMultichainCitizen,
  } = useMagicTraits();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const { mostValuableToken } = useMemo(
    () => selectState(tokenPortfolioStats),
    [selectState(tokenPortfolioStats)],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const { mostValuableNFTCollection } = useMemo(
    () => selectState(nftPortfolioStats),
    [selectState(nftPortfolioStats)],
  );

  const windowToMonths = (
    window: [TNumberInMillisecond, TNumberInMillisecond],
  ) => formatDuration(window[1] - window[0]);

  const mostActiveDappInteraction = useMemo<TDappInteraction>(() => {
    let currentDappInteraction: TDappInteraction = {
      name: 'Unknown',
      count: 0,
      window: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    };
    for (const dappGenre of Object.keys(selectState(dappInteractionStats))) {
      for (const dappName of Object.keys(
        (selectState(dappInteractionStats) as any)[dappGenre],
      )) {
        const dappInteraction: TDappInteraction = (
          selectState(dappInteractionStats) as any
        )[dappGenre][dappName];
        if (dappInteraction.count > currentDappInteraction.count) {
          currentDappInteraction = dappInteraction;
        }
      }
    }
    return currentDappInteraction;
  }, [dappInteractionStats]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const [tokenBalancePercentage, nftBalancePercentage] = useMemo<
    [TNumberInPercentage, TNumberInPercentage]
  >(() => {
    const tokenBalance = selectState(tokenPortfolioStats).sumPortfolioUSDValue;
    const nftBalance = selectState(nftPortfolioStats).sumPortfolioUSDValue;
    const total = tokenBalance + nftBalance;
    return [(tokenBalance / total) * 100, (nftBalance / total) * 100];
  }, [selectState(tokenPortfolioStats), selectState(nftPortfolioStats)]);

  return (
    <section className="flex items-center justify-center flex-col">
      {stateCheck('ActivityStats', ThreeStageState.Finished) && (
        <>
          <HowBasedAreYouHeader
            scale={0.6}
            name={addressInput}
            className="text-xl"
          />
        </>
      )}
      {addressInput &&
        stateCheck('ActivityStats', ThreeStageState.Finished) && (
          <div className="flex mb-[50px] justify-center gap-[50px] items-center">
            <AnimatedComponent.OpacityFadeInDiv delay={300}>
              <div className="w-fit">
                <ProfileCard address={addressInput as any} />
              </div>
            </AnimatedComponent.OpacityFadeInDiv>
            <div className="flex flex-col gap-6">
              <LoadableContainer
                isLoading={
                  !stateCheck('HowBasedAreYou', ThreeStageState.Finished)
                }
                loadComponent={<Spinner loading={true} />}
              >
                <Box className=" gap-[20px] items-center justify-center grid grid-cols-12">
                  <div className="col-span-2">
                    <h1 className="font-bold text-sm">{UserTrait.DeFi}</h1>
                  </div>
                  <div className="col-span-8">
                    <ProgressBar percentage={defitOrArtTraitResult.score} />
                  </div>
                  <div className="col-span-2">
                    <h1 className="font-bold text-sm">{UserTrait.Art}</h1>
                  </div>
                </Box>
              </LoadableContainer>

              <LoadableContainer
                isLoading={
                  !stateCheck('HowBasedAreYou', ThreeStageState.Finished)
                }
                loadComponent={<Spinner loading={true} />}
              >
                <Box className=" gap-[20px] items-center justify-center grid grid-cols-12">
                  <div className="col-span-2">
                    <h1 className="font-bold text-sm">{UserTrait.Degen}</h1>
                  </div>
                  <div className="col-span-8">
                    <ProgressBar percentage={degenOrDiamondHandResult.score} />
                  </div>
                  <div className="col-span-2">
                    <h1 className="font-bold text-sm">
                      {UserTrait.DiamondHand}
                    </h1>
                  </div>
                </Box>
              </LoadableContainer>

              <LoadableContainer
                isLoading={
                  !stateCheck('HowBasedAreYou', ThreeStageState.Finished)
                }
                loadComponent={<Spinner loading={true} />}
              >
                <Box className=" gap-[20px] items-center justify-center grid grid-cols-12">
                  <div className="col-span-2">
                    <h1 className="font-bold text-sm">
                      {UserTrait.OriginalBuilder}
                    </h1>
                  </div>
                  <div className="col-span-8">
                    <ProgressBar
                      percentage={originalBuilderOrMultichainCitizen.score}
                    />
                  </div>
                  <div className="col-span-2">
                    <h1 className="font-bold text-sm">
                      {UserTrait.MultichainCitizen}
                    </h1>
                  </div>
                </Box>
              </LoadableContainer>
            </div>
          </div>
        )}
      <Separator className="mb-[30px]" size={'4'} />
      {stateCheck('ActivityStats', ThreeStageState.Finished) && (
        <AnimatedComponent.OpacityFadeInDiv delay={300}>
          <div className="max-w-[1200px]">
            <div className="flex items-center justify-center">
              <h2 className="mb-4 font-bold text-2xl">Activity Statistics</h2>
            </div>
            {selectState(allTransactions).length > 0 && (
              <ActivityStats
                transactions={selectState(allTransactions)}
                activityStats={selectState(activityStats)}
                mostActiveChain={selectState(chainStats).mostActiveChainID}
              />
            )}
            <div className="flex flex-wrap sm:flex-nowrap gap-4">
              <StatisticsCard
                title="👋 Most active on-chain activity"
                className="w-full mt-5"
                content={
                  <div>
                    <span>You have interacted with </span>{' '}
                    {supportedDappMetadata[
                      mostActiveDappInteraction.name as keyof typeof supportedDappMetadata
                    ] && (
                      <Image
                        src={
                          supportedDappMetadata[
                            mostActiveDappInteraction.name as keyof typeof supportedDappMetadata
                          ]
                        }
                        alt={`Logo of ${mostActiveDappInteraction.name}`}
                        width={20}
                        height={20}
                        className="mr-2 ml-1 inline-flex"
                      />
                    )}
                    {mostActiveDappInteraction.name}{' '}
                    <span className="font-bold">
                      {mostActiveDappInteraction.count} times
                    </span>{' '}
                    in the last{' '}
                    <span className="font-bold">
                      {windowToMonths(mostActiveDappInteraction.window)}
                    </span>
                  </div>
                }
              />
              <StatisticsCard
                title="↔️ Swap transactions"
                className="w-full mt-5"
                content={
                  <div>
                    Total DeFi transactions you made is{' '}
                    <span className="font-bold">
                      {selectState(defiActivityStats).sumCount}
                    </span>{' '}
                    in total.
                  </div>
                }
              />
              <StatisticsCard
                title="🏃‍♀️ Longest active streak"
                className="w-full mt-5"
                content={
                  <div>
                    You are active for{' '}
                    <span className="font-bold">
                      {selectState(activityStats).longestStreakDays}
                    </span>{' '}
                    unique days.
                  </div>
                }
              />
              <StatisticsCard
                title="🌍 Most active blockchain"
                className="w-full mt-5"
                content={
                  <div>
                    You are most active on{' '}
                    <span className="font-bold">
                      {selectState(chainStats).mostActiveChainName}
                    </span>
                    . Longest streak{' '}
                    <span className="font-bold">
                      {selectState(chainStats).countUniqueDaysActiveChain}
                    </span>{' '}
                    days.
                  </div>
                }
              />
            </div>
          </div>
        </AnimatedComponent.OpacityFadeInDiv>
      )}
      {stateCheck('ActivityStats', ThreeStageState.Finished) &&
        stateCheck('GetTokenActivity', ThreeStageState.Finished) &&
        stateCheck('GetTokenPortfolio', ThreeStageState.Finished) &&
        // stateCheck('GetNftActivity', ThreeStageState.Finished) &&
        stateCheck('GetNftPortfolio', ThreeStageState.Finished) && (
          <>
            <Separator className="mt-[80px]" size={'4'} />
            <div className="mt-8">
              <div className="flex items-center justify-center">
                <h2 className="mb-4 font-bold text-2xl">Multi-chain Assets</h2>
              </div>
              {tokenPortfolio.length > 0 && (
                <section className="mt-2 flex justify-center items-center flex-col">
                  <MultiAssetsPortfolio
                    tokenPortfolioStats={selectState(tokenPortfolioStats)}
                    nftPortfolio={selectState(nftPortfolio)}
                    nftPortfolioStats={selectState(nftPortfolioStats)}
                  />
                  <div className="flex flex-wrap sm:flex-nowrap mt-5 gap-4">
                    <AnimatedComponent.OpacityFadeInDiv delay={300}>
                      <StatisticsCard
                        className="w-full"
                        title="🏆 Most valuable asset"
                        content={
                          <div>
                            <img
                              src={mostValuableToken.logoURI}
                              alt={`${mostValuableToken.name} logo`}
                              className="mr-1 inline-block h-6 w-6 rounded-full"
                            />
                            <span>
                              {mostValuableToken.name} (
                              {mostValuableToken.symbol}), worth&nbsp;
                              <span className="font-bold">
                                {formatNumberUSD(mostValuableToken.value)}
                              </span>
                            </span>
                          </div>
                        }
                      />
                    </AnimatedComponent.OpacityFadeInDiv>
                    <AnimatedComponent.OpacityFadeInDiv delay={400}>
                      <StatisticsCard
                        className="w-full"
                        title="💪 Longest holding streak"
                        content={
                          <div>
                            You've been holding{' '}
                            <span className="font-bold">
                              {selectState(longestHoldingToken).symbol}
                            </span>{' '}
                            for over{' '}
                            <span className="font-bold">
                              {formatDuration(
                                selectState(longestHoldingToken).duration,
                              )}
                            </span>
                          </div>
                        }
                      />
                    </AnimatedComponent.OpacityFadeInDiv>
                    <AnimatedComponent.OpacityFadeInDiv delay={500}>
                      <StatisticsCard
                        title="💰 Assets allocation"
                        className="w-full"
                        content={
                          <div>
                            <span className="font-bold">
                              {tokenBalancePercentage.toFixed(2)}%
                            </span>{' '}
                            of your wallet balance is in tokens, compared in{' '}
                            <span className="font-bold">
                              {nftBalancePercentage.toFixed(2)}%
                            </span>{' '}
                            in NFTs.
                          </div>
                        }
                      />
                    </AnimatedComponent.OpacityFadeInDiv>
                    {mostValuableNFTCollection && (
                      <AnimatedComponent.OpacityFadeInDiv delay={400}>
                        <StatisticsCard
                          title="💸 Most valuable NFT"
                          className="w-full"
                          content={
                            <div>
                              <span className="font-bold">
                                {mostValuableNFTCollection.collectionName}
                              </span>{' '}
                              worths{' '}
                              <span className="font-bold">
                                {formatNumberUSD(
                                  mostValuableNFTCollection.totalValue,
                                )}
                              </span>
                            </div>
                          }
                        />
                      </AnimatedComponent.OpacityFadeInDiv>
                    )}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
    </section>
  );
};

export default ShowcaseBaseProfile;
