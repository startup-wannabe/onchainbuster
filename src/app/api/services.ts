import { getDagoraProfile } from './dagoraCallers';
import { lisTEVMScanTransactions } from './evmScanCallers';
import { getReservoirAddressProfile } from './reservoirCallers';
import { listVicTransactions } from './victionCallers';

export const listAllTransactionsByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB', 'BSC'];
  const results = await Promise.all([
    ...chains.map((chain) => lisTEVMScanTransactions(address, chain)),
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

export const listAllNFTBalanceByChain = async (address: string) => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB', 'BSC'];
  const results = await Promise.all([
    ...chains.map((chain) => getReservoirAddressProfile(address, chain)),
    getDagoraProfile(address),
  ]);

  // TODO: Process and union type

  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};
