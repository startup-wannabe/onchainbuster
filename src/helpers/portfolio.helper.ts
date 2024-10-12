import { TreeBuilder } from './tree.helper';

const POPULAR_MEMES = [
  'PEPE',
  'FLOKI',
  'BONK',
  'DOGE',
  'SHIB',
  'WIF',
  'NEIRO',
  'BRETT',
  'DEGEN',
  'BOME',
  'DOGS',
  'DOG',
  'TURBO',
  'MYRO',
];

const aggregateTokensByBalance = (
  tokenBalanceList: TTokenBalance[],
  marketData: TTokenSymbolDetail[],
): TSymbolAggregationBalance => {
  const aggregatedBalanceBySymbol: TSymbolAggregationBalance = {};
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
  return aggregatedBalanceBySymbol;
};

const collectChainRecordsWithTokens = (
  aggregatedBalanceBySymbol: TSymbolAggregationBalance,
) => {
  const chainRecordsWithTokens: TChainRecordWithTokens = {};
  for (const [_, details] of Object.entries(aggregatedBalanceBySymbol)) {
    for (const chain of details.chains) {
      if (!chainRecordsWithTokens[chain]) {
        chainRecordsWithTokens[chain] = {
          tokens: [],
          totalUSDValue: 0,
        };
      }
      chainRecordsWithTokens[chain].totalUSDValue += details.totalUSDValue;
      chainRecordsWithTokens[chain].tokens =
        chainRecordsWithTokens[chain].tokens.concat(details);
    }
  }
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
    chainRecordsWithTokens,
    mostValuableToken,
  };
};

export const calculateMultichainTokenPortfolio = (
  tokenBalanceList: TTokenBalance[],
  marketData: TTokenSymbolDetail[],
): TTokenPortfolioStats => {
  let sumPortfolioUSDValue = 0;
  for (const { symbol, tokenBalance } of tokenBalanceList) {
    const tokenPrice =
      marketData.find((data) => data.symbol === symbol)?.currentUSDPrice || 0;
    sumPortfolioUSDValue += tokenBalance * tokenPrice;
  }

  let sumMemeUSDValue = 0;
  for (const { symbol, tokenBalance } of tokenBalanceList) {
    const tokenPrice =
      marketData.find((data) => data.symbol === symbol)?.currentUSDPrice || 0;
    const tags = marketData.find((data) => data.symbol === symbol)?.tags || [];
    if (tags.includes('memes') || POPULAR_MEMES.includes(symbol)) {
      sumMemeUSDValue += tokenBalance * tokenPrice;
    }
  }

  const aggregatedBalanceBySymbol: TSymbolAggregationBalance =
    aggregateTokensByBalance(tokenBalanceList, marketData);

  const { chainRecordsWithTokens, mostValuableToken } =
    collectChainRecordsWithTokens(aggregatedBalanceBySymbol);

  const chainCircularPackingData = buildCircularPackingChart(
    chainRecordsWithTokens,
  );

  return {
    sumPortfolioUSDValue,
    sumMemeUSDValue,
    mostValuableToken,
    aggregatedBalanceBySymbol,
    chainRecordsWithTokens,
    chainCircularPackingData,
  };
};

export const buildCircularPackingChart = (
  chains: TChainRecordWithTokens,
): TCircularTree => {
  const portfolioBuilder = new TreeBuilder('Multichain Portfolio', 0);
  for (const [chain, chainData] of Object.entries(chains)) {
    const treeBuilder = new TreeBuilder(chain, chainData.totalUSDValue);
    for (const token of chains[chain].tokens) {
      treeBuilder.addNewChildren({
        type: 'leaf',
        name: token.name,
        value: token.totalUSDValue,
      });
    }
    portfolioBuilder.addNewChildren(treeBuilder.build());
  }
  return portfolioBuilder.build();
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
