import { useQuery } from '@tanstack/react-query';
import {
  listEtherscanTransactions,
  listVicTransactions,
  searchAddressFromOneID,
} from './explorerCallers';

export const explorerRouteKey = {
  etherscan: 'etherscan',
  vicscan: 'vicscan',
};

export const useListEtherscanTransactions = (
  address: string,
  chain: string,
) => {
  return useQuery({
    queryKey: [explorerRouteKey.etherscan, address, chain],
    queryFn: () => listEtherscanTransactions(address, chain),
  });
};

export const useListVicTransactions = (account: string) => {
  return useQuery({
    queryKey: [explorerRouteKey.vicscan],
    queryFn: () => listVicTransactions(account),
  });
};

export const useSearchAddressFromOneID = (text: string) => {
  return useQuery({
    queryKey: ['oneid'],
    queryFn: () => searchAddressFromOneID(text),
  });
};
