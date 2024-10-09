import { listAlchemyTokenBalance } from './alchemyCallers';
import {
  listDagoraAddressActivity,
  listDagoraAddressBalance,
} from './dagoraCallers';
import {
  listEVMScanTokenActivity,
  listEVMScanTransactions,
} from './evmScanCallers';
import {
  listReservoirAddressActivity,
  listReservoirAddressBalance,
} from './reservoirCallers';
import {
  listVicTokenActivity,
  listVicTokenBalance,
  listVicTransactions,
} from './victionCallers';

export const listAllTransactionsByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB', 'BSC'];
  const results = await Promise.all([
    ...chains.map((chain) => listEVMScanTransactions(address, chain)),
    listVicTransactions(address),
  ]);

  // TODO: Process and union type
  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
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
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};

export const listAllTokenActivityByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB', 'BSC'];
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

  const chains = ['ETH', 'BASE', 'OP', 'ARB', 'BSC'];
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

  const chains = ['ETH', 'BASE', 'OP', 'ARB', 'BSC'];
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
