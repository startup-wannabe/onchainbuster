import {
  calculateMultichainNFTPortfolio,
  formatNumberUSD,
} from '@helpers/portfolio.helper';
import Title from '../Title';

type NFTPortfolioProps = {
  nftPortfolio: TNFTBalance[];
};

const NFTPortfolio = ({ nftPortfolio }: NFTPortfolioProps) => {
  const { sumPortfolioUSDValue, mostValuableNFTCollection } =
    calculateMultichainNFTPortfolio(nftPortfolio);

  return (
    <section className="mt-2">
      <Title title="Multi-chain Portfolio" />
      <h2>Portfolio value: {formatNumberUSD(sumPortfolioUSDValue)}</h2>
      <h3>
        Your most valuable collection is:{' '}
        {mostValuableNFTCollection.collectionName}
      </h3>
      <div>
        <img
          src={mostValuableNFTCollection.collectionImage}
          alt={`${mostValuableNFTCollection.collectionName} logo`}
          className="h-20 w-20 rounded-sm"
        />
        <span>
          You own {mostValuableNFTCollection.totalCount} NFT worth of{' '}
          {formatNumberUSD(mostValuableNFTCollection.totalValue)}
        </span>
      </div>

      <p>All NFT Collection</p>
      <div className="flex flex-row flex-wrap items-start justify-around gap-8 px-6 pb-9">
        {nftPortfolio.map((nft) => (
          <div key={`${nft.chain}-${nft.collectionAddress}`}>
            <h3>{nft.collectionName}</h3>
            <img
              src={nft.collectionImage}
              alt={`${nft.collectionName} logo`}
              className="h-20 w-20 rounded-sm"
            />
            <span>
              You own {nft.totalCount} worth of{' '}
              {formatNumberUSD(nft.totalValue)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NFTPortfolio;
