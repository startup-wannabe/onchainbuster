import { useMagic } from '@/app/hooks/useMagic';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { ThreeStageState } from '@/app/state.type';
import { supportedDappMetadata } from '@/constants/dapps';
import { Separator } from '@radix-ui/themes';
import Image from 'next/image';
import React, { useMemo } from 'react';
import ActivityStats from '../ActivityStats';
import AnimatedComponent from '../AnimatedComponent';
import HowBasedAreYouHeader from '../HowBasedAreYouHeader';
import StatisticsCard from '../StatisticsCard';
import { selectState } from '@/helpers';
import TokenPortfolio from '../TokenPortfolio';
import { formatNumberUSD } from '@/helpers/portfolio.helper';
import { formatDuration } from '@/helpers/activity.helper';

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
  } = useMagicContext();

  const { mostValuableToken } = useMemo(
    () => selectState(tokenPortfolioStats),
    [selectState(tokenPortfolioStats)],
  );

  const windowToMonths = (window: [number, number]) =>
    formatDuration((window[1] - window[0]) / (1000 * 60 * 24 * 12));

  const mostActiveDappInteraction = useMemo<TDappInteraction>(() => {
    let currentDappInteraction: TDappInteraction = {
      name: 'Unknown',
      count: 0,
      window: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    };
    for (const dappGenre of Object.keys(selectState(dappInteractionStats))) {
      console.log('dappGenre: ', dappGenre);
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
            <div className="flex">
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
                        width={40}
                        height={40}
                        className="mr-2 ml-1 inline-block"
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
                    You are acitve for{' '}
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
        stateCheck('GetTokenPortfolio', ThreeStageState.Finished) && (
          <React.Fragment>
            <Separator className="mt-[80px]" size={'4'} />
            <div className="mt-8">
              <div className="flex items-center justify-center">
                <h2 className="mb-4 font-bold text-2xl">Multi-chain Assets</h2>
              </div>
              {tokenPortfolio.length > 0 && (
                <section className="mt-2 flex justify-center items-center flex-col">
                  <TokenPortfolio
                    tokenPortfolioStats={selectState(tokenPortfolioStats)}
                  />
                  <div className="flex flex-wrap mt-5">
                    <AnimatedComponent.OpacityFadeInDiv delay={300}>
                      <StatisticsCard
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
                        title="💪 Longest holding streak"
                        content={
                          <div>
                            You've been holding{' '}
                            <span className="font-bold">
                              {selectState(longestHoldingToken).symbol}
                            </span>{' '}
                            for over <br />
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
                        content={
                          <div>
                            <span className="font-bold">51%</span> of your
                            wallet balance is in tokens, <br />
                            compared in <span className="font-bold">49%</span>{' '}
                            in NFTs.
                          </div>
                        }
                      />
                    </AnimatedComponent.OpacityFadeInDiv>
                  </div>
                </section>
              )}
            </div>
          </React.Fragment>
        )}
    </section>
  );
};

export default ShowcaseBaseProfile;
