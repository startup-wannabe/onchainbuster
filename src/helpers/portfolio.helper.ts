export const calculateMultichainTokenPortfolio = (
  tokenBalanceList: TTokenBalance[],
  marketData: TTokenSymbolDetail[],
): TTokenPortfolioStats => {
  // Aggregate balances by token
  const aggregatedBalanceBySymbol: Record<
    string,
    {
      totalBalance: number;
      chains: Set<string>;
      name: string;
      logoURI: string;
      price: number;
      totalUSDValue: number;
      tags: string[];
      date_added: string;
    }
  > = {};

  for (const {
    symbol,
    tokenBalance,
    chain,
    logoURI,
    name,
  } of tokenBalanceList) {
    if (!aggregatedBalanceBySymbol[symbol]) {
      aggregatedBalanceBySymbol[symbol] = {
        totalBalance: 0,
        chains: new Set(),
        name,
        logoURI: logoURI || '',
        price: 0,
        totalUSDValue: 0,
        tags: [],
        date_added: '',
      };
    }
    const tokenPrice =
      marketData.find((data) => data.symbol === symbol)?.currentUSDPrice || 0;
    const tags = marketData.find((data) => data.symbol === symbol)?.tags || [];
    const date_added =
      marketData.find((data) => data.symbol === symbol)?.date_added || '';

    aggregatedBalanceBySymbol[symbol].tags = tags;
    aggregatedBalanceBySymbol[symbol].date_added = date_added;
    aggregatedBalanceBySymbol[symbol].price = tokenPrice;
    aggregatedBalanceBySymbol[symbol].chains.add(chain);
    aggregatedBalanceBySymbol[symbol].price = tokenPrice;
    aggregatedBalanceBySymbol[symbol].totalBalance += tokenBalance;
    aggregatedBalanceBySymbol[symbol].totalUSDValue +=
      tokenBalance * tokenPrice;
  }

  const aggregatedBalanceByChain: Record<string, number> = {};

  for (const [_, details] of Object.entries(aggregatedBalanceBySymbol)) {
    for (const chain of details.chains) {
      if (!aggregatedBalanceByChain[chain]) {
        aggregatedBalanceByChain[chain] = 0;
      }
      aggregatedBalanceByChain[chain] += details.totalUSDValue;
    }
  }
  // Calculate sumPortfolioUSDValue
  let sumPortfolioUSDValue = 0;
  for (const [_, details] of Object.entries(aggregatedBalanceBySymbol)) {
    sumPortfolioUSDValue += details.totalUSDValue;
  }

  // Calculate mostValuableToken
  let mostValuableToken = {
    name: '',
    symbol: '',
    value: 0,
    logoURI: '',
  };

  let mostValuableTokenUSDValue = 0;
  for (const [token, details] of Object.entries(aggregatedBalanceBySymbol)) {
    if (details.totalUSDValue > mostValuableTokenUSDValue) {
      mostValuableToken = {
        name: details.name,
        symbol: token,
        value: details.totalUSDValue,
        logoURI: details.logoURI,
      };
      mostValuableTokenUSDValue = details.totalUSDValue;
    }
  }

  return {
    sumPortfolioUSDValue,
    mostValuableToken,
    aggregatedBalanceBySymbol,
    aggregatedBalanceByChain,
  };
};
export function formatNumberUSD(num: number) {
  return num.toLocaleString('it-IT', { style: 'currency', currency: 'USD' });
}

export const calculateMultichainNFTPortfolio = (
  nftBalanceList: TNFTBalance[],
): TNFTPortfolioStats => {
  // Calculate sumPortfolioUSDValue
  let sumPortfolioUSDValue = 0;
  for (const nft of nftBalanceList) {
    sumPortfolioUSDValue += nft.totalValue;
  }

  // Calculate mostValuableNFTCollection
  const mostValuableNFTCollection = nftBalanceList.reduce((prev, current) =>
    prev && prev.totalValue > current.totalValue ? prev : current,
  );

  return {
    sumPortfolioUSDValue,
    mostValuableNFTCollection,
  };
};
