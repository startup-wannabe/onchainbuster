type TActivityStats = {
  totalTxs: number;
  firstActiveDay: Date | null;
  uniqueActiveDays: number;
  uniqueActiveDays12M: number;
  uniqueActiveDays6M: number;
  uniqueActiveDays3M: number;
  longestStreakDays: number;
  currentStreakDays: number;
  activityPeriod: number;
};
