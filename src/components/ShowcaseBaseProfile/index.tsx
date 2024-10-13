import { useMagic } from '@/app/hooks/useMagic';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { ThreeStageState } from '@/app/state.type';
import { Separator } from '@radix-ui/themes';
import React, { useMemo } from 'react';
import ActivityStats from '../ActivityStats';
import AnimatedComponent from '../AnimatedComponent';
import HowBasedAreYouHeader from '../HowBasedAreYouHeader';
import StatisticsCard from '../StatisticsCard';
import TokenPortfolio from '../TokenPortfolio';

type Props = {
  addressInput: string;
};

const ShowcaseBaseProfile = ({ addressInput }: Props) => {
  const {
    query: { stateCheck },
  } = useMagic();
  const {
    allTransactions: [allTransactions],
    activityStats: [activityStats],
    chainStats: [chainStats],
    tokenPortfolio: [tokenPortfolio],
    marketData: [marketData],
    dappInteractionStats: [dappInteractionStats],
    defiActivityStats: [defiActivityStats],
  } = useMagicContext();

  const windowToMonths = (window: [number, number]) =>
    ((window[1] - window[0]) / (1000 * 60 * 24 * 12)).toFixed(0);

  const mostActiveDappInteraction = useMemo<TDappInteraction>(() => {
    let currentDappInteraction: TDappInteraction = {
      name: 'Unknown',
      count: 0,
      window: [0, 0],
    };
    for (const dappGenre of Object.keys(dappInteractionStats)) {
      for (const dappName of Object.keys(
        (dappInteractionStats as any)[dappGenre],
      )) {
        const dappInteraction: TDappInteraction = (dappInteractionStats as any)[
          dappGenre
        ][dappName];
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
        <React.Fragment>
          <HowBasedAreYouHeader
            scale={0.6}
            name={addressInput}
            className="text-xl"
          />
        </React.Fragment>
      )}
      {stateCheck('ActivityStats', ThreeStageState.Finished) && (
        <AnimatedComponent.OpacityFadeInDiv delay={300}>
          <div className="max-w-[1200px]">
            <div className="flex items-center justify-center">
              <h2 className="mb-4 font-bold text-2xl">Activity Statistics</h2>
            </div>
            {allTransactions.length > 0 && (
              <ActivityStats
                transactions={allTransactions}
                activityStats={activityStats}
                mostActiveChain={chainStats.mostActiveChainID}
              />
            )}
            <div className="flex">
              <StatisticsCard
                title="👋 Most active on-chain activity"
                className="w-full mt-5"
                content={
                  <div>
                    You have interacted with {mostActiveDappInteraction.name}{' '}
                    <span className="font-bold">
                      {mostActiveDappInteraction.count} times
                    </span>{' '}
                    in the last{' '}
                    <span className="font-bold">
                      {windowToMonths(mostActiveDappInteraction.window)} months.
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
                      {defiActivityStats.sumCount}
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
                      {activityStats.longestStreakDays}
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
                      {chainStats.mostActiveChainName}
                    </span>
                    . Longest streak{' '}
                    <span className="font-bold">
                      {chainStats.countUniqueDaysActiveChain}
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
                <TokenPortfolio
                  tokenPortfolio={tokenPortfolio}
                  marketData={marketData}
                />
              )}
            </div>
          </React.Fragment>
        )}
    </section>
  );
};

export default ShowcaseBaseProfile;
