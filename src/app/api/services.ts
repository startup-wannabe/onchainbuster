// Testing API call - Please use analyticalServices for insights
import { castVICToEVMTransactionType } from '@/helpers/transaction.helper';
import { listAlchemyTokenBalance } from './alchemyCallers';
import {
  listDagoraAddressActivity,
  listDagoraAddressBalance,
} from './dagoraCallers';
import {
  getEVMScanBalance,
  listEVMScanTokenActivity,
  listEVMScanTransactions,
} from './evmScanCallers';
import {
  listReservoirAddressActivity,
  listReservoirAddressBalance,
} from './reservoirCallers';
import { listStaticTokenMetadata } from './tokenCallers';
import {
  getVicNativeBalance,
  listVicTokenActivity,
  listVicTokenBalance,
  listVicTransactions,
} from './victionCallers';

export const getAllANativeTokenByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => getEVMScanBalance(address, chain)),
    getVicNativeBalance(address),
  ]);

  // TODO: Process and union type
  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};

export const listAllTransactionsByChain = async (
  address: string,
): Promise<Record<string, TEVMScanTransaction[]>> => {
  if (address === '') {
    return {
      eth: [],
      base: [],
      op: [],
      arb: [],
      vic: [],
    };
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => listEVMScanTransactions(address, chain)),
    listVicTransactions(address),
  ]);

  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: castVICToEVMTransactionType(
      results[results.length - 1] as TVicscanTransaction[],
    ),
  };
};

export const listAllTokenBalanceByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const alchemyChains = [
    'eth-mainnet',
    'base-mainnet',
    'opt-mainnet',
    'arb-mainnet',
  ];
  const results = await Promise.all([
    ...alchemyChains.map((chain) => listAlchemyTokenBalance(address, chain)),
    listVicTokenBalance(address),
  ]);

  // TODO: Process and union type
  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [
        chain.toLowerCase(),
        results[index]
          .map((token: any) => {
            const metadata = listStaticTokenMetadata(
              chain,
              token.contractAddress,
            );
            if (metadata) {
              return {
                ...token,
                ...metadata,
                tokenBalance: token.tokenBalance / 10 ** metadata.decimals,
              };
            }
            return null;
          })
          .filter((token) => token !== null),
      ]),
    ),
    vic: results[results.length - 1],
  };
};

export const listAllTokenActivityByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => listEVMScanTokenActivity(address, chain)),
    listVicTokenActivity(address),
  ]);

  // TODO: Process and union type
  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};

export const listAllNFTBalanceByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => listReservoirAddressBalance(address, chain)),
    listDagoraAddressBalance(address),
  ]);

  // TODO: Process and union type
  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};

export const listAllNFTActivityByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => listReservoirAddressActivity(address, chain)),
    listDagoraAddressActivity(address),
  ]);

  // TODO: Process and union type
  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};
