import { chainIDMap } from '@/constants/chains';
import { formatNumberUSD } from '@/helpers/portfolio.helper';
import { Table } from '@radix-ui/themes';

type Props = {
  aggregatedBalanceBySymbol: TSymbolAggregationBalance;
};

const TokenPortfolioTable = ({ aggregatedBalanceBySymbol }: Props) => {
  return (
    <Table.Root className="shadow-xl rounded-xl border border-palette-line/20">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Token</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>USD Value</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Chain</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Market Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Total Balance</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(aggregatedBalanceBySymbol)
          .filter(([_, { totalUSDValue }]) => totalUSDValue > 0.001)
          .sort(([, tokenA], [, tokenB]) =>
            tokenA.totalUSDValue > tokenB.totalUSDValue ? -1 : 1,
          )
          .slice(0, 6)
          .map(
            ([
              token,
              {
                chains,
                logoURI,
                name,
                totalUSDValue,
                totalBalance,
                decimals,
                price,
              },
            ]) => (
              <Table.Row key={token}>
                <Table.Cell>
                  <img
                    src={logoURI}
                    alt={`${name} logo`}
                    className="mr-1 inline-block h-6 w-6 rounded-full"
                  />
                  {token}
                </Table.Cell>
                <Table.Cell>{formatNumberUSD(totalUSDValue)}</Table.Cell>
                <Table.Cell>
                  {Array.from(chains).map(({ chainName }) => (
                    <img
                      key={chainName}
                      src={chainIDMap[chainName].logoURI}
                      alt={`${chainIDMap[chainName].name} logo`}
                      className="mr-1 inline-block h-6 w-6 rounded-full"
                    />
                  ))}
                </Table.Cell>
                <Table.Cell>{formatNumberUSD(price)}</Table.Cell>
                <Table.Cell>
                  {totalBalance.toFixed(Math.min(decimals, 5))}
                </Table.Cell>
              </Table.Row>
            ),
          )}
      </Table.Body>
    </Table.Root>
  );
};

export default TokenPortfolioTable;
