import {
  calculateMultichainTokenPortfolio,
  formatNumberUSD,
} from '@/helpers/portfolio.helper';
import AnimatedComponent from '../AnimatedComponent';
import { CircularPackingChart } from '../CircularPackingChart';
import StatisticsCard from '../StatisticsCard';
import TokenPortfolioTable from '../TokenPortfolioTable';

type TokenPortfolioProps = {
  tokenPortfolio: TTokenBalance[];
  marketData: TTokenSymbolDetail[];
};

const TokenPortfolio = ({
  tokenPortfolio,
  marketData,
}: TokenPortfolioProps) => {
  const {
    sumPortfolioUSDValue,
    mostValuableToken,
    aggregatedBalanceBySymbol,
    chainCircularPackingData,
  } = calculateMultichainTokenPortfolio(tokenPortfolio, marketData);

  return (
    <section className="mt-2 flex justify-center items-center flex-col">
      <AnimatedComponent.OpacityFadeInDiv delay={200}>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center flex-col items-center">
            <h1 className="font-bold text-xl">
              Total value is {formatNumberUSD(sumPortfolioUSDValue)}
            </h1>
            <CircularPackingChart
              data={chainCircularPackingData}
              height={300}
              width={400}
            />
          </div>
          <TokenPortfolioTable
            aggregatedBalanceBySymbol={aggregatedBalanceBySymbol}
          />
        </div>
      </AnimatedComponent.OpacityFadeInDiv>
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
                  {mostValuableToken.name} ({mostValuableToken.symbol}),
                  worth&nbsp;
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
                You've been holding <span className="font-bold">BNB</span> for
                over <br />
                <span className="font-bold">18 months</span>
              </div>
            }
          />
        </AnimatedComponent.OpacityFadeInDiv>
        <AnimatedComponent.OpacityFadeInDiv delay={500}>
          <StatisticsCard
            title="💰 Assets allocation"
            content={
              <div>
                <span className="font-bold">51%</span> of your wallet balance is
                in tokens, <br />
                compared in <span className="font-bold">49%</span> in NFTs.
              </div>
            }
          />
        </AnimatedComponent.OpacityFadeInDiv>
      </div>
    </section>
  );
};

export default TokenPortfolio;
