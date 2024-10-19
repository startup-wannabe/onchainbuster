import { chainIDMap } from '@/constants/chains';
import {
  AAVE,
  AERODROME,
  ALL_DEFI_INTERACTION,
  BARYON,
  BASE_BRIDGE,
  BLUR_NFT_MARKETPLACE,
  COMPOUND,
  COW_SWAP,
  CURVE,
  DAGORA,
  DEX_INTERACTION,
  EIGENLAYER,
  ENS,
  GMX,
  LEND_BORROW_STAKE_INTERACTION,
  LIDO,
  MAGIC_EDEN,
  MOONWELL,
  ONEID,
  ONEINCH,
  OPENSEA_MARKETPLACE,
  OP_BRIDGE,
  PANCAKE_SWAP,
  PENDLE,
  PUFFER,
  RELAY,
  SWELL,
  SYNTHETIX,
  UNISWAP,
  VELODROME,
  VENUS,
  VIC_SPACEGATE,
  ZORA,
} from '@/constants/contracts';

export const calculateGasInETH = (gasPrice: number, gasUsed: number) => {
  const gwei = 10 ** 9;
  return (gasPrice / gwei) * (gasUsed / gwei);
};

// Acknowledgement: https://github.com/base-org/web/blob/master/apps/web/src/components/Basenames/UsernameProfileSectionHeatmap/index.tsx#L115
export const calculateEVMStreaksAndMetrics = (
  transactions: TEVMScanTransaction[],
  address: string,
): TActivityStats => {
  console.log(transactions, address);
  const filteredTransactions = transactions.filter(
    (tx) => tx.from.toLowerCase() === address.toLowerCase(), // Filter from Txs only
  );

  const timestamps = transactions.map((tx) =>
    Number.parseInt(tx.timeStamp, 10),
  );
  const firstTransactionDate = new Date(Math.min(...timestamps) * 1000);

  // TODO: Enhance filter logic to distinguish between from and to txs for activeDay
  if (filteredTransactions.length === 0) {
    return {
      totalTxs: 0,
      firstActiveDay: firstTransactionDate,
      uniqueActiveDays: 0,
      longestStreakDays: 0,
      currentStreakDays: 0,
      activityPeriod: 0,
    };
  }
  const lastTransactionDate = new Date(Math.max(...timestamps) * 1000);

  const uniqueActiveDaysSet = new Set(
    filteredTransactions.map((tx) =>
      new Date(Number.parseInt(tx.timeStamp, 10) * 1000).toDateString(),
    ),
  );

  const sortedDates = Array.from(uniqueActiveDaysSet)
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreakDays = 0;
  let streak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (
      i === 0 ||
      (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) /
        (1000 * 60 * 60 * 24) ===
        1
    ) {
      streak++;
    } else {
      longestStreakDays = Math.max(longestStreakDays, streak);
      streak = 1;
    }
  }
  longestStreakDays = Math.max(longestStreakDays, streak);

  return {
    totalTxs: transactions.length, // Revert to get all transaction
    firstActiveDay: firstTransactionDate,
    uniqueActiveDays: uniqueActiveDaysSet.size,
    longestStreakDays,
    currentStreakDays:
      sortedDates[sortedDates.length - 1].toDateString() ===
      new Date().toDateString()
        ? streak
        : 0,
    activityPeriod: Math.max(
      Math.ceil(
        (lastTransactionDate.getTime() - firstTransactionDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
      1,
    ),
  };
};

// Function Names
const SWAP_FUNCTION_NAMES = ['swap', 'fillOtcOrderWithEth', 'proxiedSwap'];
const STAKE_FUNCTION_NAMES = ['wrap', 'unwrap', 'submit', 'deposit'];
const LEND_FUNCTION_NAMES = [
  'mint',
  'borrow',
  'redeem',
  'borrow',
  'redeem',
  'repay',
  'liquidate',
  'seize',
  'accrue',
  'allow',
  'supply',
  'withdraw',
];

export const calculateDeFiActivityStats = (
  transactions: TEVMScanTransaction[],
): TDeFiActivityStats => {
  // All defi transactions (swap, lend, stake, borrow)
  const sumCount = transactions.filter(
    (tx) =>
      ALL_DEFI_INTERACTION.has(tx.to.toLowerCase()) ||
      ALL_DEFI_INTERACTION.has(tx.from.toLowerCase()),
  ).length;

  const swapCount = transactions.filter((tx) =>
    DEX_INTERACTION.has(tx.to.toLowerCase()),
  ).length;

  const dexCount = transactions.filter(
    (tx) =>
      DEX_INTERACTION.has(tx.to.toLowerCase()) ||
      DEX_INTERACTION.has(tx.from.toLowerCase()),
  ).length;

  const lendCount = transactions.filter(
    (tx) =>
      LEND_BORROW_STAKE_INTERACTION.has(tx.to.toLowerCase()) ||
      LEND_BORROW_STAKE_INTERACTION.has(tx.from.toLowerCase()),
  ).length;

  return { sumCount, swapCount, dexCount, lendCount } as TDeFiActivityStats;
};

export const calculateTokenActivityStats = (
  tokenActivities: TTokenActivity[],
  marketData: TTokenSymbolDetail[],
) => {
  const sumCount = tokenActivities.length;

  // Recent token = date_added on CMC less than recent 12 months
  const recentTokenActivities = tokenActivities.filter((act) => {
    const token = marketData.find((data) => data.symbol === act.symbol);
    if (token) {
      const dateAdded = new Date(token.date_added);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 12);
      return dateAdded > threeMonthsAgo;
    }
    return false;
  });

  const newCount = recentTokenActivities.length;

  return { sumCount, newCount } as TTokenActivityStats;
};

export const calculateNFTActivityStats = (
  nftActivities: TNFTActivityV2[],
  address: string,
) => {
  // All NFT actions
  const sumCount = nftActivities.length;

  // Filter out VIC Scan - since it's didn't have duplicated data
  const vicNFTActivities = nftActivities.filter((item) => item.chain === 'vic');
  const evmNFTActivities = nftActivities.filter((item) => item.chain !== 'vic');

  const dedupKeys = [
    'chain',
    'blockHash',
    'from',
    'to',
    'timestamp',
    'tokenId',
    'tokenName',
    'tokenSymbol',
  ];
  // 1 buy/sale action with have additional transfer transaction
  // -> First filter all the duplicated records (~= trading activity)
  // having the same blockHash, tokenId, tokenName, tokenSymbol, from, to
  // -> Dedup on records with the same blockHash, tokenId, tokenName, tokenSymbol, from, to
  const seen = new Set();
  const evmDedupNFTActivities = evmNFTActivities.filter((item) => {
    // Create a unique key based on the specified fields
    const key = dedupKeys
      .map((field) => item[field as keyof TNFTActivityV2])
      .join('|');
    if (seen.has(key)) {
      return true; // Duplicate found
    }
    seen.add(key); // Mark this combination as seen
    return false; // Do not keep this item yet
  });

  // Concat all
  const cleanedNFTActivity = evmDedupNFTActivities.concat(vicNFTActivities);

  // Activity type:
  // Mint: from === 0x00000...
  // Sale: from !== 0x00000... && to === address: Ignore mint
  // Buy: from === address && to !== 0x00000... : Ignore burn
  const mintCount = cleanedNFTActivity.filter((act) =>
    act.from.toLowerCase().includes('0x00000000000'),
  ).length;

  const buyCount = cleanedNFTActivity.filter(
    (act) =>
      !act.from.toLowerCase().includes('0x00000000000') &&
      act.to.toLowerCase() === address.toLowerCase(),
    // TODO: It still contains transferActivities -.-
  ).length;

  const saleCount = cleanedNFTActivity.filter(
    (act) =>
      act.from.toLowerCase() === address.toLowerCase() &&
      !act.to.toLowerCase().includes('0x00000000000'),
    // TODO: It still contains transferActivities -.-
  ).length;

  const tradeCount = buyCount + saleCount;

  return {
    sumCount,
    tradeCount,
    saleCount,
    buyCount,
    mintCount,
  } as TNFTActivityStats;
};

export const calculateDappInteraction = (
  transactions: TEVMScanTransaction[],
): TDAppInteractionMap => {
  // Initialize all the platform interaction maps with default values
  const defaultWindow: [number, number] = [
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  ];
  const dappInteractionMap: TDAppInteractionMap = {
    marketplace: {
      opensea: { name: 'OpenSea', window: defaultWindow, count: 0 },
      blur: { name: 'Blur', window: defaultWindow, count: 0 },
      magicEden: { name: 'Magic Eden', window: defaultWindow, count: 0 },
      dagora: { name: 'Dagora', window: defaultWindow, count: 0 },
      zora: { name: 'Zora', window: defaultWindow, count: 0 },
    },
    defi: {
      uniswap: { name: 'Uniswap', window: defaultWindow, count: 0 },
      curve: { name: 'Curve', window: defaultWindow, count: 0 },
      pendle: { name: 'Pendle', window: defaultWindow, count: 0 },
      aave: { name: 'Aave', window: defaultWindow, count: 0 },
      oneinch: { name: '1INCH', window: defaultWindow, count: 0 },
      cow: { name: 'CoW Swap', window: defaultWindow, count: 0 },
      aero: { name: 'Aerodrome', window: defaultWindow, count: 0 },
      velo: { name: 'Velodrome', window: defaultWindow, count: 0 },
      moonwell: { name: 'Moonwell', window: defaultWindow, count: 0 },
      eigenlayer: { name: 'EigenLayer', window: defaultWindow, count: 0 },
      puffer: { name: 'Puffer', window: defaultWindow, count: 0 },
      lido: { name: 'Lido', window: defaultWindow, count: 0 },
      swell: { name: 'Swell', window: defaultWindow, count: 0 },
      gmx: { name: 'GMX', window: defaultWindow, count: 0 },
      pancake: { name: 'PancakeSwap', window: defaultWindow, count: 0 },
      synthetix: { name: 'Synthetix', window: defaultWindow, count: 0 },
      compound: { name: 'Compound', window: defaultWindow, count: 0 },
      venus: { name: 'Venus', window: defaultWindow, count: 0 },
      baryon: { name: 'Baryon', window: defaultWindow, count: 0 },
    },
    bridge: {
      relay: { name: 'Relay Bridge', window: defaultWindow, count: 0 },
      spacegate: { name: 'SpaceGate', window: defaultWindow, count: 0 },
      op: { name: 'OP Native Bridge', window: defaultWindow, count: 0 },
      base: {
        name: 'Base Native Bridge (Deprecated)',
        window: defaultWindow,
        count: 0,
      },
    },
    nameService: {
      ens: {
        name: 'Ethereum Name Service (ENS)',
        window: defaultWindow,
        count: 0,
      },
      oneid: { name: 'OneID', window: defaultWindow, count: 0 },
    },
  };

  // List of DApp interaction maps paired with their respective contract sets
  const dappAndContractList: [TDappInteraction, Set<string> | string][] = [
    [dappInteractionMap.marketplace.opensea, OPENSEA_MARKETPLACE],
    [dappInteractionMap.marketplace.blur, BLUR_NFT_MARKETPLACE],
    [dappInteractionMap.marketplace.magicEden, MAGIC_EDEN],
    [dappInteractionMap.marketplace.dagora, DAGORA],
    [dappInteractionMap.marketplace.zora, ZORA],
    [dappInteractionMap.defi.uniswap, UNISWAP],
    [dappInteractionMap.defi.curve, CURVE],
    [dappInteractionMap.defi.pendle, PENDLE],
    [dappInteractionMap.defi.aave, AAVE],
    [dappInteractionMap.defi.oneinch, ONEINCH],
    [dappInteractionMap.defi.cow, COW_SWAP],
    [dappInteractionMap.defi.aero, AERODROME],
    [dappInteractionMap.defi.velo, VELODROME],
    [dappInteractionMap.defi.moonwell, MOONWELL],
    [dappInteractionMap.defi.gmx, GMX],
    [dappInteractionMap.defi.pancake, PANCAKE_SWAP],
    [dappInteractionMap.defi.baryon, BARYON],
    [dappInteractionMap.defi.eigenlayer, EIGENLAYER],
    [dappInteractionMap.defi.puffer, PUFFER],
    [dappInteractionMap.defi.lido, LIDO],
    [dappInteractionMap.defi.swell, SWELL],
    [dappInteractionMap.defi.compound, COMPOUND],
    [dappInteractionMap.defi.venus, VENUS],
    [dappInteractionMap.defi.synthetix, SYNTHETIX],

    [dappInteractionMap.bridge.relay, RELAY],
    [dappInteractionMap.bridge.op, OP_BRIDGE],
    [dappInteractionMap.bridge.base, BASE_BRIDGE],
    [dappInteractionMap.bridge.spacegate, VIC_SPACEGATE],
    [dappInteractionMap.nameService.ens, ENS],
    [dappInteractionMap.nameService.oneid, ONEID],
  ];

  for (const tx of transactions) {
    const lowerCaseTo = tx.to.toLowerCase();
    const lowerCaseFrom = tx.from.toLowerCase();
    const txTimestamp = Number.parseInt(tx.timeStamp);
    // Iterate over the dappAndContractList to update counts and windows
    for (const [dapp, contract] of dappAndContractList) {
      // TODO: More accurate filter on Lido, Swell, Compound
      const contractIncluded =
        typeof contract === 'string'
          ? contract === lowerCaseTo.toLowerCase() ||
            contract === lowerCaseFrom.toLowerCase()
          : contract.has(lowerCaseTo) || contract.has(lowerCaseFrom);
      if (contractIncluded) {
        dapp.count++;
        // Update the window for the DApp
        const [windowStart, windowEnd] = dapp.window;
        dapp.window = [
          Math.min(txTimestamp, windowStart),
          Math.max(txTimestamp, windowEnd),
        ];
      }
    }
  }

  return dappInteractionMap;
};

type Holding = {
  amount: number;
  timestamp: number;
};

/**
 * Function to find the asset with the longest holding duration.
 * @param chain - The blockchain network (e.g., Ethereum, Binance Smart Chain).
 * @param transactions - Array of buy/sell transactions.
 * @param address - The address of the user.
 * @returns The asset with the longest holding duration and the duration in milliseconds.
 */
export const findLongestHoldingToken = (
  chain: string,
  transactions: TTokenActivity[],
  address: string,
): TLongestHoldingToken => {
  const holdings: Record<string, Holding[]> = {}; // Updated to include chain
  let longestDuration = 0;
  let longestAsset = '';

  // Sort timestamp asc
  const sortedTransactions = transactions.sort((a, b) =>
    Number.parseInt(a.timestamp) > Number.parseInt(b.timestamp) ? 1 : -1,
  );

  // If it's a buy transaction, add to holdings
  for (const { symbol, from, to, value, timestamp } of sortedTransactions) {
    if (to.toLowerCase() === address.toLowerCase()) {
      if (!holdings[symbol]) {
        holdings[symbol] = [];
      }

      holdings[symbol].push({
        amount: Number.parseInt(value || '0'),
        timestamp: Number.parseInt(timestamp),
      });
    }

    // If it's a sell transaction, calculate holding duration
    if (from.toLowerCase() === address.toLowerCase()) {
      let remainingSellAmount = Number.parseInt(value || '0');

      // Process each holding for this asset
      while (
        remainingSellAmount > 0 &&
        holdings[symbol] &&
        holdings[symbol].length > 0
      ) {
        const holding = holdings[symbol][0]; // Get the earliest buy
        const holdingDuration = Number.parseInt(timestamp) - holding.timestamp; // Holding duration

        // If selling the full amount of this holding
        if (remainingSellAmount >= holding.amount) {
          remainingSellAmount -= holding.amount;
          holdings[symbol].shift(); // Remove this holding since it's fully sold
        } else {
          // If partially selling this holding
          holding.amount -= remainingSellAmount;
          remainingSellAmount = 0; // All sold
        }

        // Check if this holding has the longest duration
        if (holdingDuration > longestDuration) {
          longestDuration = holdingDuration;
          longestAsset = symbol;
        }
      }
    }
  }

  return {
    chain: chainIDMap[chain].name,
    chainLogoURI: chainIDMap[chain].logoURI,
    symbol: longestAsset,
    duration: longestDuration,
  };
};

/**
 * Converts seconds into a human-readable time duration (days, hours, minutes, seconds).
 * @param seconds - The duration in seconds.
 * @returns A string representing the time duration.
 */
export const formatDuration = (seconds: number): string => {
  const years = Math.floor(seconds / (3600 * 24 * 365));
  const months = Math.floor((seconds % (3600 * 24 * 365)) / (3600 * 24 * 30));
  const days = Math.floor((seconds % (3600 * 24 * 30)) / (3600 * 24));
  // const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  // const minutes = Math.floor((seconds % 3600) / 60);
  // const remainingSeconds = seconds % 60;

  const parts = [];
  if (years > 0) {
    parts.push(`${years} year${years > 1 ? 's' : ''}`);
  }
  if (months > 0) {
    parts.push(`${months} month${months > 1 ? 's' : ''}`);
  }
  if (days > 0) {
    parts.push(`${days} day${days > 1 ? 's' : ''}`);
  }
  // if (hours > 0) {
  //   parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  // }
  // if (minutes > 0) {
  //   parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  // }
  // if (remainingSeconds > 0 || parts.length === 0) {
  //   parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`);
  // }

  return parts.join(', ');
};
