import type React from 'react';

import { formatNumberUSD } from '@/helpers/portfolio.helper';
import { ResponsivePie } from '@nivo/pie';
import { Box } from '@radix-ui/themes';

type Props = {
  data: TPieChartData[];
  children?: React.ReactNode | React.ReactNode[];
  rootStyle?: React.CSSProperties;
  tooltipHidden?: boolean;
  innerHidden?: boolean;
};

const margin = { top: 40, right: 40, bottom: 40, left: 40 };

const styles: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: 'consolas, sans-serif',
    textAlign: 'center',
    position: 'relative',
    width: 300,
    height: 280,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: margin.right,
    bottom: 0,
    left: margin.left,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    pointerEvents: 'none',
  },
};

const TotalBalancePieChart = ({
  data,
  children,
  rootStyle,
  innerHidden,
  tooltipHidden,
}: Props) => {
  return (
    <div style={{ ...styles.root, ...rootStyle }}>
      <ResponsivePie
        enableArcLabels={false}
        enableArcLinkLabels={false}
        data={data}
        margin={margin}
        innerRadius={0.9}
        padAngle={1}
        colors={data.map((item) => item.color)}
        cornerRadius={3}
        tooltip={({ datum }) =>
          tooltipHidden ? (
            <></>
          ) : (
            <Box className="bg-white shadow-xl px-3 py-3 rounded-full">
              {datum.label} :{' '}
              <span className="font-bold">
                {formatNumberUSD(datum.data.value)}
              </span>
            </Box>
          )
        }
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
      />
      {!innerHidden && <div style={styles.overlay}>{children}</div>}
    </div>
  );
};

export default TotalBalancePieChart;
