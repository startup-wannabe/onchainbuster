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
      totalTxs: countTxs,
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
