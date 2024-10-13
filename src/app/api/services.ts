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
import { getTalentPassportByWallet } from './talentCallers';
import {
  getVicNativeBalance,
  listVicAllActivity,
  listVicTokenBalance,
  listVicTransactions,
} from './victionCallers';

// ---- Blockchain Transactions ----
export const listAllTransactionsByChain = async (
  address: string,
): Promise<
  Record<string, { txs: TEVMScanTransaction[]; chainName: string }>
> => {
  let value: Record<string, { txs: TEVMScanTransaction[]; chainName: string }> =
    {
      eth: {
        chainName: 'Ethereum',
        txs: [],
      },
      base: {
        chainName: 'Base',
        txs: [],
      },
      op: {
        chainName: 'Optimism',
        txs: [],
      },
      arb: {
        chainName: 'Arbitrum',
        txs: [],
      },
      vic: {
        chainName: 'Viction',
        txs: [],
      },
    };
  if (address === '') return value;

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => listEVMScanTransactions(address, chain)),
    listVicTransactions(address),
  ]);

  value = {
    ...Object.fromEntries(
      chains.map((chain, index) => [
        chain.toLowerCase(),
        {
          txs: results[index],
          chainName: (value as any)[chain.toLowerCase()].chainName,
        },
      ]),
    ),
    vic: {
      txs: castVICToEVMTransactionType(
        results[results.length - 1] as TVicscanTransaction[],
      ),
      chainName: 'Viction',
    },
  };
  return value;
};

// --- Token Balance & Activity ---
export const getMultichainPortfolio = async (
  address: string,
): Promise<TTokenBalance[]> => {
  const [nativeTokenBalance, tokenBalance] = await Promise.all([
    getAllANativeTokenByChain(address),
    listAllTokenBalanceByChain(address),
  ]);

  return Object.values(nativeTokenBalance)
    .flat()
    .concat(Object.values(tokenBalance).flat());
};

export const getAllANativeTokenByChain = async (
  address: string,
): Promise<Record<string, TTokenBalance[]>> => {
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
    ...chains.map((chain) => getEVMScanBalance(address, chain)),
    getVicNativeBalance(address),
  ]);

  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};

export const listAllTokenBalanceByChain = async (
  address: string,
): Promise<Record<string, TTokenBalance[]>> => {
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

  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1] as any,
  };
};

export const listAllTokenActivityByChain = async (
  address: string,
): Promise<Record<string, TTokenActivity[]>> => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => listEVMScanTokenActivity(address, chain)),
    listVicAllActivity(address),
  ]);

  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index].token]),
    ),
    vic: results[results.length - 1].token,
  };
};

// ---- NFT Balance & Activity ----
export const listAllNFTBalanceByChain = async (
  address: string,
): Promise<Record<string, TNFTBalance[]>> => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => listReservoirAddressBalance(address, chain)),
    listDagoraAddressBalance(address),
  ]);

  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};

export const listAllNFTActivityByChain = async (
  address: string,
): Promise<Record<string, TNFTActivity[]>> => {
  if (address === '') {
    return {};
  }

  const chains = ['ETH', 'BASE', 'OP', 'ARB'];
  const results = await Promise.all([
    ...chains.map((chain) => listReservoirAddressActivity(address, chain)),
    listDagoraAddressActivity(address),
  ]);

  return {
    ...Object.fromEntries(
      chains.map((chain, index) => [chain.toLowerCase(), results[index]]),
    ),
    vic: results[results.length - 1],
  };
};

// Talent Passport
export const getTalentScore = async (
  address: string,
): Promise<TTalentPassportScore> => {
  return (await getTalentPassportByWallet(address)) as TTalentPassportScore;
};
