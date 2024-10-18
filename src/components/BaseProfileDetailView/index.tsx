import React from 'react';
import { useMagic } from '@/app/hooks/useMagic';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { ThreeStageState } from '@/app/state.type';
import { supportedDappMetadata } from '@/constants/dapps';
import { selectState } from '@/helpers';
import { formatDuration } from '@/helpers/activity.helper';
import { formatNumberUSD } from '@/helpers/portfolio.helper';
import { Separator } from '@radix-ui/themes';
import Image from 'next/image';
import { useMemo } from 'react';
import ActivityStats from '../ActivityStats';
import AnimatedComponent from '../AnimatedComponent';
import MultiAssetsPortfolio from '../MultiAssetsPortfolio';
import StatisticsCard from '../StatisticsCard';
import Title from '../Title';

type Props = {};

const BaseProfileDetailView = (props: Props) => {
  const {
    query: { stateCheck },
  } = useMagic();
  const {
    allTransactions,
    activityStats,
    chainStats,
    tokenPortfolio,
    tokenPortfolioStats,
    nftPortfolioStats,
    nftPortfolio,
  } = useMagicContext();

  return (
    <React.Fragment>
      {stateCheck('ActivityStats', ThreeStageState.Finished) && (
        <div className="mt-[50px]">
          <AnimatedComponent.OpacityFadeInDiv delay={300}>
            <div className="max-w-[1200px]">
              <div className="flex items-center justify-center">
                <Title title="Activity Statistics" />
              </div>
              {selectState(allTransactions).length > 0 && (
                <ActivityStats
                  transactions={selectState(allTransactions)}
                  activityStats={selectState(activityStats)}
                  mostActiveChain={selectState(chainStats).mostActiveChainID}
                />
              )}
            </div>
          </AnimatedComponent.OpacityFadeInDiv>
        </div>
      )}
      {stateCheck('ActivityStats', ThreeStageState.Finished) &&
        stateCheck('GetTokenActivity', ThreeStageState.Finished) &&
        stateCheck('GetTokenPortfolio', ThreeStageState.Finished) &&
        stateCheck('GetNftActivity', ThreeStageState.Finished) &&
        stateCheck('GetNftPortfolio', ThreeStageState.Finished) && (
          <div className="mt-[50px]">
            <div className="mt-8">
              <div className="flex items-center justify-center">
                <Title title="Multi-chain Assets" />
              </div>
              {tokenPortfolio.length > 0 && (
                <section className="mt-2 flex justify-center items-center flex-col">
                  <MultiAssetsPortfolio
                    tokenPortfolioStats={selectState(tokenPortfolioStats)}
                    nftPortfolio={selectState(nftPortfolio)}
                    nftPortfolioStats={selectState(nftPortfolioStats)}
                  />
                </section>
              )}
            </div>
          </div>
        )}
    </React.Fragment>
  );
};

export default BaseProfileDetailView;
