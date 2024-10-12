import { chainIDMap } from "@/constants/chains";
import {
  calculateMultichainTokenPortfolio,
  formatNumberUSD,
} from "@/helpers/portfolio.helper";
import Title from "../Title";
import { CircularTree } from "@/helpers/portfolio";
import { CircularPackingChart } from "../CircularPackingChart";

type TokenPortfolioProps = {
  tokenPortfolio: TTokenBalance[];
  marketData: TTokenSymbolDetail[];
};

const mockData: CircularTree = {
  type: "node",
  name: "boss",
  value: 0,
  children: [
    {
      type: "node",
      name: "Team Dataviz",
      value: 0,
      children: [
        { type: "leaf", name: "Mark", value: 90 },
        { type: "leaf", name: "Robert", value: 42 },
        { type: "leaf", name: "Emily", value: 34 },
        { type: "leaf", name: "Marion", value: 53 },
      ],
    },
    {
      type: "node",
      name: "Team DevOps",
      value: 0,
      children: [
        { type: "leaf", name: "Nicolas", value: 98 },
        { type: "leaf", name: "Malki", value: 22 },
        { type: "leaf", name: "Djé", value: 12 },
      ],
    },
    {
      type: "node",
      name: "Team Sales",
      value: 0,
      children: [
        { type: "leaf", name: "Mélanie", value: 45 },
        { type: "leaf", name: "Einstein", value: 76 },
      ],
    },
  ],
};

const TokenCircularPackingChart = () => {
  return (
    <div className="mt-6 w-fit px-10 py-5 rounded-3xl shadow-xl border border-palette-line/20">
      <CircularPackingChart data={mockData} height={400} width={400} />
    </div>
  );
};

const TokenPortfolio = ({
  tokenPortfolio,
  marketData,
}: TokenPortfolioProps) => {
  const {
    sumPortfolioUSDValue,
    sumMemeUSDValue,
    mostValuableToken,
    aggregatedBalanceBySymbol,
    aggregatedBalanceByChain,
  } = calculateMultichainTokenPortfolio(tokenPortfolio, marketData);
  return (
    <section className="mt-2">
      <Title title="Multi-chain Portfolio" />
      <TokenCircularPackingChart />
      <p>Portfolio value: {formatNumberUSD(sumPortfolioUSDValue)}</p>
      <p>Meme value: {formatNumberUSD(sumMemeUSDValue)}</p>
      <span>
        Your most valuable asset is{" "}
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
              )
            )}
        </tbody>
      </table>
    </section>
  );
};

export default TokenPortfolio;
