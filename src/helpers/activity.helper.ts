import {
  AAVE,
  AERODROME,
  BASE_BRIDGE,
  BLUR_NFT_MARKETPLACE,
  COW_SWAP,
  CURVE,
  DAGORA,
  ENS,
  MAGIC_EDEN,
  MOONWELL,
  ONEID,
  ONEINCH,
  OPENSEA_MARKETPLACE,
  OP_BRIDGE,
  PENDLE,
  RELAY,
  UNISWAP,
  VELODROME,
} from '@/constants/dapps';

type Holding = {
  amount: number;
  timestamp: number;
};

// Acknowledgement: https://github.com/base-org/web/blob/master/apps/web/src/components/Basenames/UsernameProfileSectionHeatmap/index.tsx#L115
export const calculateEVMStreaksAndMetrics = (
  transactions: TEVMScanTransaction[],
  address: string,
): TActivityStats => {
  const countTxs = transactions.length;
  const filteredTransactions = transactions.filter(
    (tx) => tx.from.toLowerCase() === address.toLowerCase(),
  );
  if (filteredTransactions.length === 0) {
    return {
      totalTxs: 0,
      firstActiveDay: null,
      uniqueActiveDays: 0,
      uniqueActiveDays12M: 0,
      uniqueActiveDays6M: 0,
      uniqueActiveDays3M: 0,
      longestStreakDays: 0,
      currentStreakDays: 0,
      activityPeriod: 0,
    };
  }

  const timestamps = filteredTransactions.map((tx) =>
    Number.parseInt(tx.timeStamp, 10),
  );
  const firstTransactionDate = new Date(Math.min(...timestamps) * 1000);
  const lastTransactionDate = new Date(Math.max(...timestamps) * 1000);

  const uniqueActiveDaysSet = new Set(
    filteredTransactions.map((tx) =>
      new Date(Number.parseInt(tx.timeStamp, 10) * 1000).toDateString(),
    ),
  );

  const currentDate = new Date();
  const dateRanges = [
    {
      name: '12M',
      date: new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate(),
      ),
    },
    {
      name: '6M',
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 6,
        currentDate.getDate(),
      ),
    },
    {
      name: '3M',
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 3,
        currentDate.getDate(),
      ),
    },
  ];

  const uniqueActiveDays = dateRanges.reduce(
    (acc, range) => {
      acc[`uniqueActiveDays${range.name}`] = new Set(
        filteredTransactions
          .filter((tx) => {
            const txDate = new Date(Number.parseInt(tx.timeStamp, 10) * 1000);
            return txDate >= range.date && txDate <= currentDate;
          })
          .map((tx) =>
            new Date(Number.parseInt(tx.timeStamp, 10) * 1000).toDateString(),
          ),
      );
      return acc;
    },
    {} as Record<string, Set<string>>,
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
    totalTxs: countTxs,
    firstActiveDay: firstTransactionDate,
    uniqueActiveDays: uniqueActiveDaysSet.size,
    uniqueActiveDays12M: uniqueActiveDays.uniqueActiveDays12M.size,
    uniqueActiveDays6M: uniqueActiveDays.uniqueActiveDays6M.size,
    uniqueActiveDays3M: uniqueActiveDays.uniqueActiveDays3M.size,
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

export const calculateDappInteraction = (
  transactions: TEVMScanTransaction[],
): TDAppInteraction12MMap => {
  return {
    marketplace: {
      opensea: {
        name: 'OpenSea',
        count: transactions.filter(
          (tx) =>
            OPENSEA_MARKETPLACE.has(tx.to.toLowerCase()) ||
            OPENSEA_MARKETPLACE.has(tx.from.toLowerCase()),
        ).length,
      },
      blur: {
        name: 'Blur',
        count: transactions.filter(
          (tx) =>
            BLUR_NFT_MARKETPLACE.has(tx.to.toLowerCase()) ||
            BLUR_NFT_MARKETPLACE.has(tx.from.toLowerCase()),
        ).length,
      },
      magicEden: {
        name: 'Magic Eden',
        count: transactions.filter(
          (tx) =>
            MAGIC_EDEN.has(tx.to.toLowerCase()) ||
            MAGIC_EDEN.has(tx.from.toLowerCase()),
        ).length,
      },
      dagora: {
        name: 'Dagora',
        count: transactions.filter(
          (tx) =>
            DAGORA.has(tx.to.toLowerCase()) ||
            DAGORA.has(tx.from.toLowerCase()),
        ).length,
      },
    },
    defi: {
      uniswap: {
        name: 'Uniswap',
        count: transactions.filter(
          (tx) =>
            UNISWAP.has(tx.to.toLowerCase()) ||
            UNISWAP.has(tx.from.toLowerCase()),
        ).length,
      },
      curve: {
        name: 'Curve',
        count: transactions.filter(
          (tx) =>
            CURVE.has(tx.to.toLowerCase()) || CURVE.has(tx.from.toLowerCase()),
        ).length,
      },
      pendle: {
        name: 'Pendle',
        count: transactions.filter(
          (tx) =>
            PENDLE.has(tx.to.toLowerCase()) ||
            PENDLE.has(tx.from.toLowerCase()),
        ).length,
      },

      aave: {
        name: 'Aave',
        count: transactions.filter(
          (tx) =>
            AAVE.has(tx.to.toLowerCase()) || AAVE.has(tx.from.toLowerCase()),
        ).length,
      },

      oneinch: {
        name: '1INCH',
        count: transactions.filter(
          (tx) =>
            ONEINCH.has(tx.to.toLowerCase()) ||
            ONEINCH.has(tx.from.toLowerCase()),
        ).length,
      },

      cow: {
        name: 'CoW Swap',
        count: transactions.filter(
          (tx) =>
            COW_SWAP.has(tx.to.toLowerCase()) ||
            COW_SWAP.has(tx.from.toLowerCase()),
        ).length,
      },

      aero: {
        name: 'Aerodrome',
        count: transactions.filter(
          (tx) =>
            AERODROME.has(tx.to.toLowerCase()) ||
            AERODROME.has(tx.from.toLowerCase()),
        ).length,
      },

      velo: {
        name: 'Velodrome',
        count: transactions.filter(
          (tx) =>
            VELODROME.has(tx.to.toLowerCase()) ||
            VELODROME.has(tx.from.toLowerCase()),
        ).length,
      },

      moonwell: {
        name: 'Moonwell',
        count: transactions.filter(
          (tx) =>
            MOONWELL.has(tx.to.toLowerCase()) ||
            MOONWELL.has(tx.from.toLowerCase()),
        ).length,
      },
    },
    bridge: {
      relay: {
        name: 'Relay Bridge',
        count: transactions.filter(
          (tx) =>
            RELAY.has(tx.to.toLowerCase()) || RELAY.has(tx.from.toLowerCase()),
        ).length,
      },
      op: {
        name: 'OP Native Bridge',
        count: transactions.filter(
          (tx) =>
            OP_BRIDGE === tx.to.toLowerCase() ||
            OP_BRIDGE === tx.from.toLowerCase(),
        ).length,
      },
      base: {
        name: 'Base Native Bridge (Deprecated)',
        count: transactions.filter(
          (tx) =>
            BASE_BRIDGE === tx.to.toLowerCase() ||
            BASE_BRIDGE === tx.from.toLowerCase(),
        ).length,
      },
    },
    nameService: {
      ens: {
        name: 'Ethereum Name Service (ENS)',
        count: transactions.filter(
          (tx) =>
            ENS.has(tx.to.toLowerCase()) || ENS.has(tx.from.toLowerCase()),
        ).length,
      },
      oneid: {
        name: 'OneID',
        count: transactions.filter(
          (tx) =>
            ONEID.has(tx.to.toLowerCase()) || ONEID.has(tx.from.toLowerCase()),
        ).length,
      },
    },
  } as TDAppInteractionMap;
};
/**
 * Function to find the asset with the longest holding duration.
 * @param transactions - Array of buy/sell transactions.
 * @returns The asset with the longest holding duration and the duration in milliseconds.
 */
export const findLongestHoldingAsset = (
  transactions: TTokenActivity[],
  address: string,
): { asset: string; duration: number } => {
  const holdings: Record<string, Holding[]> = {};
  let longestDuration = 0;
  let longestAsset = '';

  for (const { symbol, from, to, value, timestamp } of transactions) {
    // If it's a buy transaction, add to holdings
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
    asset: longestAsset,
    duration: longestDuration,
  };
};

/**
 * Converts seconds into a human-readable time duration (days, hours, minutes, seconds).
 * @param seconds - The duration in seconds.
 * @returns A string representing the time duration.
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (days > 0) {
    parts.push(`${days} day${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`);
  }

  return parts.join(', ');
};
