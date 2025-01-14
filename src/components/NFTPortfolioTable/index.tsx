import { formatNumberUSD } from '@/helpers/portfolio.helper';
import { Avatar, Table } from '@radix-ui/themes';
import ChainIcon from '../ChainIcon';

type NFTPortfolioProps = {
  nftPortfolio: TNFTBalance[];
};

const NFTPortfolioTable = ({ nftPortfolio }: NFTPortfolioProps) => {
  return (
    <>
      <Table.Root className="shadow-xl rounded-xl border border-palette-line/20 h-full">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Collection Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Items</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Chain</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Total Valuation</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Floor Price</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {nftPortfolio
            .sort((tokenA, tokenB) =>
              tokenA.totalValue > tokenB.totalValue ? -1 : 1,
            )
            .slice(0, 6)
            .map((nft) => (
              <Table.Row key={`${nft.chain}-${nft.collectionAddress}`}>
                <Table.Cell>
                  <div className="flex gap-4">
                    <Avatar
                      className="rounded-xl w-[25px] h-[25px]"
                      alt={`${nft.collectionName} logo`}
                      src={nft.collectionImage}
                      fallback={nft.collectionName.slice(0, 3)}
                    />
                    {nft.collectionName}
                  </div>
                </Table.Cell>
                <Table.Cell>{nft.totalCount}</Table.Cell>
                <Table.Cell>
                  <ChainIcon chainId={nft.chain} />
                </Table.Cell>
                <Table.Cell>{formatNumberUSD(nft.totalValue)}</Table.Cell>
                <Table.Cell>{formatNumberUSD(nft.floorPrice)}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default NFTPortfolioTable;
