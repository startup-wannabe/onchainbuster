import tokenList from '@constants/tokenList.json';

const tokenListJSON: TTokenList = JSON.parse(JSON.stringify(tokenList));
const chainIDMap = {
  eth: 1,
  base: 8453,
  arb: 42161,
  op: 10,
  bsc: 56,
};

export const listStaticTokenMetadata = (
  chain: string,
  contractAdress: string,
) => {
  const chainId =
    chainIDMap[chain.toLowerCase() as keyof typeof chainIDMap] ||
    chain.toLowerCase();

  const chainTokens =
    tokenListJSON.tokens.filter((token) => token.chainId === chainId) || [];

  return chainTokens.find(
    (t: TTokenCurrency) =>
      t.address?.toLowerCase() === contractAdress.toLowerCase(),
  );
};
