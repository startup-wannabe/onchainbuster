import {
  buildTotalBalancePieChart,
  formatNumberUSD,
} from '@/helpers/portfolio.helper';
import AnimatedComponent from '../AnimatedComponent';
import { CircularPackingChart } from '../CircularPackingChart';
import TokenPortfolioTable from '../TokenPortfolioTable';
import NFTPortfolioTable from '../NFTPortfolioTable';
import React from 'react';
import TotalBalancePieChart from '../TotalBalancePieChart';

type Props = {
  tokenPortfolioStats: TTokenPortfolioStats;
  nftPortfolioStats: TNFTPortfolioStats;
  nftPortfolio: TNFTBalance[];
};

const MultiAssetsPortfolio = ({
  tokenPortfolioStats,
  nftPortfolio,
  nftPortfolioStats,
}: Props) => {
  const { aggregatedBalanceBySymbol, chainCircularPackingData } =
    tokenPortfolioStats;
  return (
    <React.Fragment>
      <div className="flex justify-center flex-col items-center">
        <AnimatedComponent.OpacityFadeInDiv delay={200}>
          <React.Fragment>
            <div className="relative">
              <TotalBalancePieChart
                rootStyle={{
                  width: 500,
                  height: 500,
                }}
                data={buildTotalBalancePieChart(
                  tokenPortfolioStats,
                  nftPortfolioStats,
                )}
              />
              <div className="absolute top-[100px] left-[100px]">
                <CircularPackingChart
                  data={chainCircularPackingData}
                  height={300}
                  width={300}
                />
              </div>
            </div>
            <h1 className="font-bold text-center text-xl mb-7">
              Total value is{' '}
              {formatNumberUSD(
                tokenPortfolioStats.sumPortfolioUSDValue +
                  nftPortfolioStats.sumPortfolioUSDValue,
              )}
            </h1>
          </React.Fragment>
        </AnimatedComponent.OpacityFadeInDiv>
        <AnimatedComponent.OpacityFadeInDiv delay={300}>
          <div className="flex gap-4 justify-between items-center w-full">
            <TokenPortfolioTable
              aggregatedBalanceBySymbol={aggregatedBalanceBySymbol}
            />
            <NFTPortfolioTable nftPortfolio={nftPortfolio} />
          </div>
        </AnimatedComponent.OpacityFadeInDiv>
      </div>
    </React.Fragment>
  );
};

export default MultiAssetsPortfolio;
