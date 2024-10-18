import React from 'react';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { selectState } from '@/helpers';
import ActivityStats from '../ActivityStats';
import AnimatedComponent from '../AnimatedComponent';
import MultiAssetsPortfolio from '../MultiAssetsPortfolio';
import Title from '../Title';

type Props = {};

const BaseProfileDetailView = (props: Props) => {
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
      <div className="mt-[50px]">
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
      </div>
      <div className="mt-[20px]">
        <div className="mt-8">
          <div className="flex items-center justify-center mb-6">
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
    </React.Fragment>
  );
};

export default BaseProfileDetailView;
