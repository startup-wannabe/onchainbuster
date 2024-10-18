import { useMagicContext } from '@/app/hooks/useMagicContext';
import { useMagicTraits } from '@/app/hooks/useMagicTraits';
import { selectState } from '@/helpers';
import {
  buildTotalBalancePieChart,
  formatNumberCompact,
  formatNumberUSD,
} from '@/helpers/portfolio.helper';
import { Box, Grid } from '@radix-ui/themes';
import React, { useMemo } from 'react';
import DecorativeCard from '../DecorativeCard';
import ChainIcon from '../ChainIcon';
import AnimatedComponent from '../AnimatedComponent';
import ProfileCard from '../ProfileCard';
import { UserTrait } from '@/helpers/trait.helper';
import ProgressBar from '../ProgressBar';
import TotalBalancePieChart from '../TotalBalancePieChart';
import { supportedDappMetadata } from '@/constants/dapps';
import Image from 'next/image';
import { formatDuration } from '@/helpers/activity.helper';
import FetchingStatusOverlay from '../FetchingStatusOverlay';

type Props = {};

const MagicBaseGridCard = (props: Props) => {
  const {
    inputAddress,
    tokenPortfolioStats,
    nftPortfolioStats,
    chainStats,
    defiActivityStats,
    totalGasInETH,
    dappInteractionStats,
    allTransactions,
    longestHoldingToken,
  } = useMagicContext();
  const {
    defitOrArtTraitResult,
    degenOrDiamondHandResult,
    originalBuilderOrMultichainCitizen,
  } = useMagicTraits();

  const totalBalancePieChart = useMemo<TPieChartData[]>(
    () =>
      buildTotalBalancePieChart(
        selectState(tokenPortfolioStats),
        selectState(nftPortfolioStats),
      ),
    [tokenPortfolioStats, nftPortfolioStats],
  );

  const { mostValuableToken } = useMemo(
    () => selectState(tokenPortfolioStats),
    [selectState(tokenPortfolioStats)],
  );

  const mostActiveDappInteraction = useMemo<TDappInteraction>(() => {
    let currentDappInteraction: TDappInteraction = {
      name: 'Unknown',
      count: 0,
      window: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    };
    for (const dappGenre of Object.keys(selectState(dappInteractionStats))) {
      for (const dappName of Object.keys(
        (selectState(dappInteractionStats) as any)[dappGenre],
      )) {
        const dappInteraction: TDappInteraction = (
          selectState(dappInteractionStats) as any
        )[dappGenre][dappName];
        if (dappInteraction.count > currentDappInteraction.count) {
          currentDappInteraction = dappInteraction;
        }
      }
    }
    return currentDappInteraction;
  }, [dappInteractionStats]);
  return (
    <React.Fragment>
      <div
        id="MagicBaseGridCard"
        className="py-[50px] px-[50px] rounded-3xl shadow-xl"
        style={{
          position: 'relative',
          background: `url('/background.avif')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Grid columns="repeat(4, 260px)" gap="3" height={'auto'}>
          <DecorativeCard className="text-center flex flex-col justify-center px-5 py-5">
            <h1 className="text-blue-500 font-bold text-4xl">{2020}</h1>
            <h2>The year of first on-chain transactions</h2>
          </DecorativeCard>
          <DecorativeCard className="text-center flex flex-col justify-center px-5 py-5">
            <h1 className="text-blue-500 font-bold text-4xl">
              {formatNumberCompact(selectState(allTransactions).length, 2)}
            </h1>
            <h2>Total transactions across blockchains</h2>
          </DecorativeCard>
          <Grid gridRow={'1'} gridColumn={'3 / span 2'} width="auto">
            <DecorativeCard className="px-5 py-5">
              <div className="flex justify-start mb-3 gap-4 items-center">
                <ChainIcon
                  chainId={selectState(chainStats).mostActiveChainID}
                  width={55}
                  height={55}
                />
                <div>
                  <h1 className="text-blue-500 font-bold text-3xl">
                    {selectState(chainStats).mostActiveChainName}
                  </h1>
                  <p className="text-md">Most active blockchain</p>
                </div>
              </div>
              <h2>
                You have spent{' '}
                <span className="font-bold">
                  {selectState(chainStats).countUniqueDaysActiveChain} unique
                  days
                </span>{' '}
                on Ethereum.
              </h2>
            </DecorativeCard>
          </Grid>
          <Grid gridRow={'2'} gridColumn={'1 / span 3'} width="auto">
            <DecorativeCard className="hover:shadow-3xl cursor-pointer px-5 py-5">
              <div className="flex justify-center h-full items-center">
                <Box className="grid grid-cols-12 gap-[50px] justify-between items-center py-5 px-5">
                  <div className="col-span-6">
                    <ProfileCard address={selectState(inputAddress) as any} />
                  </div>
                  <div className="col-span-6">
                    <Box className="mb-5">
                      <div className="flex justify-between mb-3">
                        <h1 className="font-bold text-sm">{UserTrait.DeFi}</h1>
                        <h1 className="font-bold text-sm">{UserTrait.Art}</h1>
                      </div>
                      <div className="w-full">
                        <ProgressBar percentage={defitOrArtTraitResult.score} />
                      </div>
                    </Box>
                    <Box className="mb-5">
                      <div className="flex justify-between mb-3">
                        <h1 className="font-bold text-sm">{UserTrait.Degen}</h1>
                        <h1 className="font-bold text-sm">
                          {UserTrait.DiamondHand}
                        </h1>
                      </div>
                      <div className="w-full">
                        <ProgressBar
                          percentage={degenOrDiamondHandResult.score}
                        />
                      </div>
                    </Box>
                    <Box className="mb-5 min-w-[300px]">
                      <div className="flex justify-between mb-3">
                        <h1 className="font-bold text-sm">
                          {UserTrait.OriginalBuilder}
                        </h1>
                        <h1 className="font-bold text-sm">
                          {UserTrait.MultichainCitizen}
                        </h1>
                      </div>
                      <div className="w-full">
                        <ProgressBar
                          percentage={originalBuilderOrMultichainCitizen.score}
                        />
                      </div>
                    </Box>
                  </div>
                </Box>
              </div>
              {/* )} */}
            </DecorativeCard>
          </Grid>
          <DecorativeCard className="flex flex-col items-center justify-center py-5">
            <TotalBalancePieChart data={totalBalancePieChart}>
              <div className="font-bold text-2xl">
                $
                {formatNumberCompact(
                  selectState(tokenPortfolioStats).sumPortfolioUSDValue +
                    selectState(nftPortfolioStats).sumPortfolioUSDValue,
                  2,
                )}
              </div>
            </TotalBalancePieChart>
            <div className="flex flex-wrap justify-center gap-2 px-3">
              {totalBalancePieChart.map((data) => (
                <div className="border border-palette-line/20 flex gap-2 shadow-xl rounded-xl py-1 px-2 justify-center items-center">
                  <div
                    className="rounded-xl"
                    style={{
                      backgroundColor: data.color,
                      width: 'fit-content',
                      height: 'fit-content',
                      padding: '5px 5px',
                    }}
                  />
                  <ChainIcon chainId={data.id} />
                </div>
              ))}
            </div>
          </DecorativeCard>
          <Grid gridRow={'3 / span 2'} gridColumn={'1'} width="auto">
            <DecorativeCard className="px-5 py-6 flex flex-col gap-4 items-center justify-center">
              {supportedDappMetadata[
                mostActiveDappInteraction.name as keyof typeof supportedDappMetadata
              ] && (
                <Image
                  src={
                    supportedDappMetadata[
                      mostActiveDappInteraction.name as keyof typeof supportedDappMetadata
                    ]
                  }
                  alt={`Logo of ${mostActiveDappInteraction.name}`}
                  width={80}
                  height={80}
                  className="shadow-xl rounded-full"
                />
              )}
              <h1 className="font-bold text-3xl">
                {mostActiveDappInteraction.name}
              </h1>
              <h2 className="text-xl">Most active protocol</h2>
              <div className="text-center text-lg">
                You interacted with {mostActiveDappInteraction.name}{' '}
                <span className="font-bold">
                  {mostActiveDappInteraction.count} this year.
                </span>
              </div>
            </DecorativeCard>
          </Grid>
          <DecorativeCard className="text-center flex flex-col justify-center px-5 py-5">
            <h1 className="text-blue-500 font-bold text-4xl">
              {selectState(totalGasInETH).toFixed(3)} Ξ
            </h1>
            <h2>Gas fee spent</h2>
          </DecorativeCard>
          <DecorativeCard className="text-center flex flex-col justify-center px-5 py-5">
            <h1 className="text-blue-500 font-bold text-4xl">
              {selectState(defiActivityStats).sumCount}
            </h1>
            <h2>DeFi Interactions</h2>
          </DecorativeCard>
          <Grid gridRow={'4'} gridColumn={'2 / span 2'} width="auto">
            <DecorativeCard className="px-5 py-5">
              <div className="text-center">
                <h1 className="font-bold text-2xl text-blue-500">
                  {formatDuration(selectState(longestHoldingToken).duration)}
                </h1>
                <h3 className="text-xl mb-3">Longest holding time</h3>
                <div>
                  You've been holding onto{' '}
                  <span className="font-bold">
                    {selectState(longestHoldingToken).symbol}
                  </span>{' '}
                  on
                  <br />
                  <span className="inline-block align-middle">
                    <img
                      src={selectState(longestHoldingToken).chainLogoURI}
                      alt={`${selectState(longestHoldingToken).chain} logo`}
                      className="mr-1 ml-1 h-6 w-6 rounded-full"
                    />
                  </span>
                  {selectState(longestHoldingToken).chain} for a while.
                </div>
              </div>
            </DecorativeCard>
          </Grid>
          <Grid gridRow={'3 / span 2'} gridColumn={'4'} width="auto">
            <DecorativeCard className="px-5 py-5 flex flex-col items-center justify-center">
              {mostValuableToken && (
                <div className="flex flex-col gap-3 items-center justify-center">
                  <h2>Most valuable onchain asset</h2>
                  <div className="flex">
                    <img
                      style={{
                        width: 30,
                        height: 30,
                      }}
                      src={mostValuableToken.logoURI}
                      alt={`${mostValuableToken.name} logo`}
                      className="mr-1 inline-block h-6 w-6 rounded-full"
                    />
                    <h1 className="font-bold text-2xl">
                      {mostValuableToken.name.toUpperCase()} (
                      {mostValuableToken.symbol})
                    </h1>
                  </div>
                  <span>
                    Worth&nbsp;
                    <span className="font-bold">
                      {formatNumberUSD(mostValuableToken.value)}
                    </span>{' '}
                    in total
                  </span>
                </div>
              )}
            </DecorativeCard>
          </Grid>
        </Grid>
        <FetchingStatusOverlay container={false} />
      </div>
    </React.Fragment>
  );
};

export default MagicBaseGridCard;
