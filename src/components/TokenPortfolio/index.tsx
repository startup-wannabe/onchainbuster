import { chainIDMap } from '@/constants/chains';
import {
  calculateMultichainTokenPortfolio,
  formatNumberUSD,
} from '@/helpers/portfolio.helper';
import Title from '../Title';

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
    aggregatedBalanceByChain,
  } = calculateMultichainTokenPortfolio(tokenPortfolio, marketData);
  console.log(aggregatedBalanceBySymbol);
  return (
    <section className="mt-2">
      <Title title="Multi-chain Portfolio" />
      <p>Portfolio value: {formatNumberUSD(sumPortfolioUSDValue)}</p>
      <span>
        Your most valuable asset is{' '}
        <img
          src={mostValuableToken.logoURI}
          alt={`${mostValuableToken.name} logo`}
          className="mr-1 inline-block h-6 w-6 rounded-full"
        />
        <span>
          {mostValuableToken.name} ({mostValuableToken.symbol}), worth&nbsp;
          {formatNumberUSD(mostValuableToken.value)}
        </span>
      </span>

      <p>Portfolio value by chain:</p>
      {Object.entries(aggregatedBalanceByChain).map(([chain, value]) => (
        <div key={chain}>
          <span>
            <img
              key={chain}
              src={chainIDMap[chain].logoURI}
              alt={`${chainIDMap[chain].name} logo`}
              className="mr-1 inline-block h-6 w-6 rounded-full"
            />
            {chain.toUpperCase()}: {formatNumberUSD(value)}
          </span>
        </div>
      ))}

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Token</th>
            <th className="border border-gray-300 p-2">Balance</th>
            <th className="border border-gray-300 p-2">Value</th>
            <th className="border border-gray-300 p-2">Chain</th>
            <th className="border border-gray-300 p-2">Tags</th>
            <th className="border border-gray-300 p-2">Date Added</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(aggregatedBalanceBySymbol)
            .filter(([_, { totalUSDValue }]) => totalUSDValue > 0.001) // Only get non-zero token
            .map(
              ([
                token,
                {
                  totalBalance,
                  chains,
                  logoURI,
                  name,
                  totalUSDValue,
                  date_added,
                  tags,
                },
              ]) => (
                <tr key={token}>
                  <td className="border border-gray-300 p-2">
                    <img
                      src={logoURI}
                      alt={`${name} logo`}
                      className="mr-1 inline-block h-6 w-6 rounded-full"
                    />
                    <span>{token}</span>
                  </td>
                  <td className="border border-gray-300 p-2">{totalBalance}</td>
                  <td className="border border-gray-300 p-2">
                    {formatNumberUSD(totalUSDValue)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {Array.from(chains).map((chain) => (
                      <img
                        key={chain}
                        src={chainIDMap[chain].logoURI}
                        alt={`${chainIDMap[chain].name} logo`}
                        className="mr-1 inline-block h-6 w-6 rounded-full"
                      />
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {tags.map((tag) => (
                      <p key={tag}>{tag}</p>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">{date_added}</td>
                </tr>
              ),
            )}
        </tbody>
      </table>
    </section>
  );
};

export default TokenPortfolio;
