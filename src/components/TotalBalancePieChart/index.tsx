import type React from 'react';

import { formatNumberUSD } from '@/helpers/portfolio.helper';
import { ResponsivePie } from '@nivo/pie';
import { Box, Separator } from '@radix-ui/themes';
import ChainIcon from '../ChainIcon';

type Props = {
  data: TPieChartData[];
  children?: React.ReactNode | React.ReactNode[];
  rootStyle?: React.CSSProperties;
  tooltipHidden?: boolean;
  innerHidden?: boolean;
};

const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const styles: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: 'consolas, sans-serif',
    textAlign: 'center',
    position: 'relative',
    width: 250,
    height: 250,
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
        data={data.map((d) => ({
          ...d,
          value: d.value.nft + d.value.token,
          raw: d.value,
        }))}
        margin={margin}
        innerRadius={0.7}
        padAngle={1}
        colors={data.map((item) => item.color)}
        cornerRadius={3}
        tooltip={({ datum }) =>
          tooltipHidden ? (
            <></>
          ) : (
            <Box className="bg-white shadow-xl px-3 py-3 rounded-xl">
              <h1 className="text-md font-bold">
                <ChainIcon chainId={datum.id as any} /> {datum.label}
              </h1>
              <Separator size={'4'} className="my-3" />
              <div className="flex flex-col justify-start">
                <div>
                  Token:
                  <span className="font-bold">
                    {formatNumberUSD(datum.data.raw.token)}
                  </span>
                </div>
                <div>
                  NFT:
                  <span className="font-bold">
                    {formatNumberUSD(datum.data.raw.nft)}
                  </span>
                </div>
              </div>
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
