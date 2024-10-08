import { useQuery } from '@tanstack/react-query';
import { listEtherscanTransactions, listVicTransactions } from './callers';

export const apiRouteKey = {
  etherscan: 'etherscan',
  vicscan: 'vicscan',
};

export const useListEtherscanTransactions = (
  address: string,
  chain: string,
) => {
  return useQuery({
    queryKey: [apiRouteKey.etherscan, address, chain],
    queryFn: () => listEtherscanTransactions(address, chain),
  });
};

export const useListVicTransactions = (account: string) => {
  return useQuery({
    queryKey: [apiRouteKey.vicscan],
    queryFn: () => listVicTransactions(account),
  });
};
