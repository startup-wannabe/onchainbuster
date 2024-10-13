import { formatNumberUSD } from '@/helpers/portfolio.helper';
import AnimatedComponent from '../AnimatedComponent';
import { CircularPackingChart } from '../CircularPackingChart';
import StatisticsCard from '../StatisticsCard';
import TokenPortfolioTable from '../TokenPortfolioTable';

type TokenPortfolioProps = {
  tokenPortfolioStats: TTokenPortfolioStats;
};

const TokenPortfolio = ({ tokenPortfolioStats }: TokenPortfolioProps) => {
  const {
    aggregatedBalanceBySymbol,
    chainCircularPackingData,
    sumPortfolioUSDValue,
  } = tokenPortfolioStats;
  return (
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
  );
};

export default TokenPortfolio;
