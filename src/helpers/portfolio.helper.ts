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
    decimals,
  } of tokenBalanceList) {
    if (!aggregatedBalanceBySymbol[symbol]) {
      aggregatedBalanceBySymbol[symbol] = {
        totalBalance: 0,
        chains: [],
        name,
        logoURI: logoURI || '',
        price: 0,
        totalUSDValue: 0,
        tags: [],
        date_added: '',
        symbol: '',
        decimals: 5, // Display only 5 decimals
      };
    }
    const tokenPrice =
      marketData.find((data) => data.symbol === symbol)?.currentUSDPrice || 0;
    const tags = marketData.find((data) => data.symbol === symbol)?.tags || [];
    const date_added =
      marketData.find((data) => data.symbol === symbol)?.date_added || '';
    const tokenUSDValue = tokenBalance * tokenPrice;

    aggregatedBalanceBySymbol[symbol].symbol = symbol;
    aggregatedBalanceBySymbol[symbol].tags = tags;
    aggregatedBalanceBySymbol[symbol].decimals = decimals;
    aggregatedBalanceBySymbol[symbol].date_added = date_added;
    aggregatedBalanceBySymbol[symbol].price = tokenPrice;
    aggregatedBalanceBySymbol[symbol].chains.push({
      chainName: chain,
      value: tokenUSDValue,
    });
    aggregatedBalanceBySymbol[symbol].price = tokenPrice;
    aggregatedBalanceBySymbol[symbol].totalBalance += tokenBalance;
    aggregatedBalanceBySymbol[symbol].totalUSDValue += tokenUSDValue;
  }
  return aggregatedBalanceBySymbol;
};

const collectChainRecordsWithTokens = (
  aggregatedBalanceBySymbol: TSymbolAggregationBalance,
) => {
  const chainRecordsWithTokens: TChainRecordWithTokens = {};
  for (const [_, details] of Object.entries(aggregatedBalanceBySymbol)) {
    for (const { chainName, value } of details.chains) {
      if (!chainRecordsWithTokens[chainName]) {
        chainRecordsWithTokens[chainName] = {
          tokens: [],
          totalUSDValue: 0,
        };
      }
      chainRecordsWithTokens[chainName].totalUSDValue += value;
      chainRecordsWithTokens[chainName].tokens =
        chainRecordsWithTokens[chainName].tokens.concat(details);
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
        name: token.symbol,
        value: token.chains.find((c) => c.chainName === chain)?.value || 0,
      });
    }
    portfolioBuilder.addNewChildren(treeBuilder.build());
  }
  return portfolioBuilder.build();
};

export const formatNumberUSD = (num: number) => {
  return num.toLocaleString('it-IT', { style: 'currency', currency: 'USD' });
};

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
