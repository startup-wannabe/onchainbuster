import NFTPortfolioTable from '../NFTPortfolioTable';
import TokenPortfolioTable from '../TokenPortfolioTable';

type Props = {
  tokenPortfolioStats: TTokenPortfolioStats;
  nftPortfolioStats: TNFTPortfolioStats;
  nftPortfolio: TNFTBalance[];
};

const MultiAssetsPortfolio = ({ tokenPortfolioStats, nftPortfolio }: Props) => {
  const { aggregatedBalanceBySymbol } = tokenPortfolioStats;
  return (
    <>
      <div className="flex justify-center flex-col items-center">
        <div className="flex gap-4 justify-between items-start w-full">
          <TokenPortfolioTable
            aggregatedBalanceBySymbol={aggregatedBalanceBySymbol}
          />
          <NFTPortfolioTable nftPortfolio={nftPortfolio} />
        </div>
      </div>
    </>
  );
};

export default MultiAssetsPortfolio;
