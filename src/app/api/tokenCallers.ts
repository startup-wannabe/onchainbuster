import { chainIDMap } from '@constants/chains';
import tokenList from '@constants/tokenList.json';

const tokenListJSON: TTokenList = JSON.parse(JSON.stringify(tokenList));

export const listStaticTokenMetadata = (
  chain: string,
  contractAdress: string,
) => {
  const chainMetadata =
    chainIDMap[chain.toLowerCase() as keyof typeof chainIDMap] ||
    chain.toLowerCase();

  const chainTokens =
    tokenListJSON.tokens.filter(
      (token) => token.chainId === chainMetadata.id,
    ) || [];

  return chainTokens.find(
    (t: TTokenListMetadata) =>
      t.address?.toLowerCase() === contractAdress.toLowerCase(),
  );
};
