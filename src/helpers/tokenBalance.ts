// Helper function to format balance with proper decimal places
interface TokenData {
  balance: bigint;
  name: string;
  symbol: string;
  decimal: number;
}

interface TokenBalances {
  [contractAddress: string]: TokenData;
}

export const formatBalance = (balance: bigint, decimal: number): string => {
  const divisor = BigInt(10 ** decimal);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;
  return `${integerPart}.${fractionalPart.toString().padStart(decimal, '0')}`;
};

export const computeTokenHoldings = (
  transactions: TEVMScanTokenActivity[],
  address: string,
): TokenBalances => {
  const tokenBalances: TokenBalances = {};

  for (const tx of transactions) {
    if (tx.contractAddress) {
      const contractAddress = tx.contractAddress.toLowerCase();
      const value = BigInt(tx.value);

      if (!tokenBalances[contractAddress]) {
        tokenBalances[contractAddress] = {
          balance: BigInt(0),
          name: tx.tokenName,
          symbol: tx.tokenSymbol,
          decimal: Number.parseInt(tx.tokenDecimal, 10),
        };
      }

      if (tx.to.toLowerCase() === address.toLowerCase()) {
        // Receiving tokens
        tokenBalances[contractAddress].balance += value;
      } else if (tx.from.toLowerCase() === address.toLowerCase()) {
        // Sending tokens
        tokenBalances[contractAddress].balance -= value;
      }
    }
  }

  return tokenBalances;
};
