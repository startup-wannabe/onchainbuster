import * as Collapsible from '@radix-ui/react-collapsible';
import { useCallback, useRef } from 'react';
import CalendarHeatmap, {
  type ReactCalendarHeatmapValue,
} from 'react-calendar-heatmap';
import { Icon } from '../Icon';
import Title from '../Title';
// import { Address } from 'viem';
import './cal.css';

type HeatmapValue = {
  date: string;
  count: number;
};

type ActivityStatsProps = {
  transactions: TEVMScanTransaction[];
  activityStats: TActivityStats;
};

const ActivityStats = ({ transactions, activityStats }: ActivityStatsProps) => {
  // The ref/effect here are a kinda jank approach to reaching into the heatmap library's rendered dom and modifying individual rect attributes.
  const containerRef = useRef<HTMLDivElement>(null);

  const classForValue = useCallback(
    (value: ReactCalendarHeatmapValue<string> | undefined) => {
      if (!value) {
        return 'm-1 fill-[#F8F9FB]';
      } // empty
      if (value.count >= 10) {
        return 'm-1 fill-[#003EC1]';
      } // 4 - most
      if (value.count >= 7) {
        return 'm-1 fill-[#266EFF]'; // 3
      }
      if (value.count >= 4) {
        return 'm-1 fill-[#92B6FF]';
      } // 2
      if (value.count >= 1) {
        return 'm-1 fill-[#D3E1FF]';
      } // 1
      return 'm-1 fill-[#F8F9FB]'; // empty - least
    },
    [],
  );

  const titleForValue = useCallback(
    (value: ReactCalendarHeatmapValue<string> | undefined) => {
      return value ? `${value.date}: ${value.count} transactions` : '';
    },
    [],
  );

  const generateHeatmapData = (
    transactions: TEVMScanTransaction[],
  ): HeatmapValue[] => {
    const dateMap: Record<string, HeatmapValue> = {};
    for (const tx of transactions) {
      const txDate = new Date(
        Number.parseInt(tx.timeStamp) * 1000,
      ).toLocaleDateString();
      dateMap[txDate] = dateMap[txDate]
        ? { date: txDate, count: dateMap[txDate].count + 1 }
        : { date: txDate, count: 1 };
    }
    return Object.values(dateMap);
  };

  return (
    <section>
      <Title title="Activity" />
      <Collapsible.Root className="mt-6 rounded-3xl border border-palette-line/20">
        <div className="mb-6 px-6 pt-6">
          <div className="relative mb-6">
            {/* <Tooltip content="Onchain score is a number out of 100 that measures onchain activity">
              <h3 className="mb-1 flex items-center text-sm font-medium text-gray-60">
                ONCHAIN SCORE
                <Icon name="info" color="currentColor" height="12px" />
              </h3>
            </Tooltip>
            <p className="font-display text-3xl">{finalScore}/100</p> */}
            <div className="absolute right-0 flex items-center gap-1 text-xs text-palette-foregroundMuted">
              <p>Less</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="10"
                viewBox="0 0 60 10"
                fill="none"
                role="img"
                aria-label="svg"
              >
                <rect x="0" width="10" height="10" rx="2" fill="#F8F9FB" />
                <rect x="12" width="10" height="10" rx="2" fill="#D3E1FF" />
                <rect x="24" width="10" height="10" rx="2" fill="#92B6FF" />
                <rect x="36" width="10" height="10" rx="2" fill="#266EFF" />
                <rect x="48" width="10" height="10" rx="2" fill="#003EC1" />
              </svg>
              <p>More</p>
            </div>
          </div>
          <div
            ref={containerRef}
            className="w-full max-w-full overflow-x-auto overflow-y-hidden whitespace-nowrap"
          >
            <CalendarHeatmap
              startDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              endDate={new Date()}
              horizontal={true}
              values={generateHeatmapData(transactions)}
              classForValue={classForValue}
              titleForValue={titleForValue}
            />
          </div>
        </div>
        <Collapsible.Trigger className="flex w-full flex-row items-center border-t border-palette-line/20 px-6 py-4">
          <Icon name="caret" color="currentColor" width="1rem" height="1rem" />
          <p className="ml-1">View details</p>
        </Collapsible.Trigger>
        <Collapsible.Content className="flex flex-row flex-wrap items-start justify-around gap-8 px-6 pb-9 data-[state=closed]:pb-0">
          <div className="w-28">
            <div className="text-xl font-medium text-palette-primary">
              {activityStats.totalTxs}
            </div>
            <p className="text-xs text-palette-foregroundMuted">
              Total transactions (Ethereum, Base, Arbitrum, Optimism, Viction)
            </p>
          </div>

          <div className="w-28">
            <div className="text-xl font-medium text-palette-primary">
              {activityStats.firstActiveDay
                ? activityStats.firstActiveDay.toLocaleDateString()
                : 'N/A'}
            </div>
            <p className="text-xs text-palette-foregroundMuted">
              First Active Day
            </p>
          </div>
          <div className="w-28">
            <div className="text-xl font-medium text-palette-primary">
              {activityStats.uniqueActiveDays}
            </div>
            <p className="text-xs text-palette-foregroundMuted">
              Unique Active Days
            </p>
          </div>

          <div className="w-28">
            <div className="text-xl font-medium text-palette-primary">
              {activityStats.longestStreakDays}
            </div>
            <p className="text-xs text-palette-foregroundMuted">
              Day longest streak
            </p>
          </div>
          <div className="w-28">
            <div className="text-xl font-medium text-palette-primary">
              {activityStats.currentStreakDays}
            </div>
            <p className="text-xs text-palette-foregroundMuted">
              Day current streak
            </p>
          </div>
          <div className="w-28">
            <div className="text-xl font-medium text-palette-primary">
              {activityStats.activityPeriod}
            </div>
            <p className="text-xs text-palette-foregroundMuted">
              Day activity period
            </p>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </section>
  );
};

export default ActivityStats;
