import { useWagmiConfig } from '@/wagmi';
import { getEnsAddress } from '@wagmi/core';
import { toast } from 'react-toastify';
import { normalize } from 'viem/ens';
import { delayMs } from '../../helpers';
import {
  calculateDappInteraction,
  calculateDeFiActivityStats,
  calculateEVMStreaksAndMetrics,
  calculateGasInETH,
  calculateNFTActivityStats,
  calculateTokenActivityStats,
  findLongestHoldingToken,
  formatDuration,
} from '../../helpers/activity.helper';
import { listCMCTokenDetail } from '../api/cmcCallers';
import {
  getMultichainPortfolio,
  getTalentScore,
  listAllNFTActivityByChain,
  listAllNFTBalanceByChain,
  listAllTokenActivityByChain,
  listAllTransactionsByChain,
} from '../api/services';
import { searchAddressFromOneID } from '../api/victionCallers';
import {
  BinaryState,
  StateEvent,
  type StateOption,
  ThreeStageState,
  type Toastable,
} from '../state.type';
import { useMagicContext } from './useMagicContext';

export const StateSubEvents = {
  [StateEvent.HowBasedAreYou]: ThreeStageState,
  [StateEvent.ActivityStats]: ThreeStageState,
  [StateEvent.GetAddress]: BinaryState,
  [StateEvent.GetTokenPortfolio]: ThreeStageState,
  [StateEvent.GetNftPortfolio]: ThreeStageState,
  [StateEvent.GetTokenActivity]: ThreeStageState,
  [StateEvent.GetNftActivity]: ThreeStageState,
  [StateEvent.GetTalentScore]: BinaryState,
};

export const useMagic = () => {
  // biome-ignore lint/correctness/noEmptyPattern: <explanation>
  const {} = useMagic;
  const wagmiConfig = useWagmiConfig();
  const {
    stateEvents,
    setStateEvents,
    // Raw
    inputAddress: [, setInputAddress],
    builderScore: [, setBuilderScore],
    allTransactions: [, setAllTransactions],
    tokenPortfolio: [, setTokenPortfolio],
    marketData: [, setMarketData],
    nftPortfolio: [, setNftPortfolio],
    tokenActivity: [, setTokenActivity],
    nftActivity: [, setNftActivity],

    // Insights
    longestHoldingToken: [, setLongestHoldingToken],
    chainStats: [, setChainStats],
    dappInteractionStats: [, setDappInteractionStats],
    activityStats: [, setActivityStats],
    defiActivityStats: [, setDefiActivityStats],
    tokenActivityStats: [, setTokenActivityStats],
    nftActivityStats: [, setNftActivityStats],
    totalGasInETH: [, setTotalGasInETH],
  } = useMagicContext();

  const dispatchStateEvent = (eventName: StateEvent, status: StateOption) => {
    setStateEvents((stateEvents) => ({ ...stateEvents, [eventName]: status }));
  };

  const stateCheck = (
    event: keyof typeof StateEvent,
    option: StateOption,
  ): boolean => {
    return stateEvents[event] === (StateSubEvents[event] as any)[option];
  };

  async function newAsyncDispatch<Output>(
    eventName: StateEvent,
    eventHooks: {
      onStartEvent: StateOption;
      onFinishEvent: Toastable<StateOption>;
      onErrorEvent: Toastable<StateOption>;
      onResetEvent: StateOption;
    },
    method: () => Promise<Output>,
  ): Promise<Output> {
    dispatchStateEvent(eventName, eventHooks.onResetEvent);
    dispatchStateEvent(eventName, eventHooks.onStartEvent);
    try {
      const data = await method();
      const event = eventHooks.onFinishEvent;
      dispatchStateEvent(eventName, event.value);
      if (event.toast) {
        toast(event.toast, {
          type: 'success',
        });
      }
      return data;
    } catch (error: any) {
      const event = eventHooks.onErrorEvent;
      dispatchStateEvent(eventName, event.value);
      if (event.toast) {
        toast(`${event.toast} - Error: ${error.message}`, {
          type: 'error',
        });
      }
      throw new Error(error);
    }
  }

  const getAddress = async (text: string) => {
    return newAsyncDispatch(
      StateEvent.GetAddress,
      {
        onStartEvent: StateSubEvents.GetAddress.True,
        onErrorEvent: { value: StateSubEvents.GetAddress.False },
        onFinishEvent: { value: StateSubEvents.GetAddress.False },
        onResetEvent: StateSubEvents.GetAddress.False,
      },
      async () => {
        let address = '';
        if (text.startsWith('0x')) {
          address = text;
        } else if (text.endsWith('.eth')) {
          address = (await getEnsAddress(wagmiConfig, {
            name: normalize(text),
            chainId: 1,
          })) as string;
          console.log('ENS Address:', address);
          setInputAddress(address);
        } else {
          address = await searchAddressFromOneID(text);
          console.log('OneID Address:', address);
        }
        setInputAddress(address);
        return address;
      },
    );
  };

  const fetchBuilderScore = async (text: string) => {
    const address = await getAddress(text);
    return newAsyncDispatch(
      StateEvent.GetTalentScore,
      {
        onStartEvent: StateSubEvents.GetTalentScore.True,
        onErrorEvent: { value: StateSubEvents.GetTalentScore.False },
        onFinishEvent: { value: StateSubEvents.GetTalentScore.False },
        onResetEvent: StateSubEvents.GetTalentScore.False,
      },
      async () => {
        const data = await getTalentScore(address);
        console.log('Talent score:', data);
        const builderScore = data.skills_score;
        setBuilderScore(builderScore);
        return builderScore;
      },
    );
  };

  const fetchActivityStats = async (addressInput: string) => {
    const address = await getAddress(addressInput);
    return newAsyncDispatch(
      StateEvent.ActivityStats,
      {
        onStartEvent: StateSubEvents.ActivityStats.InProgress,
        onErrorEvent: { value: StateSubEvents.ActivityStats.Idle },
        onFinishEvent: {
          value: StateSubEvents.ActivityStats.Finished,
          toast: 'Activity stats fetched.',
        },
        onResetEvent: StateSubEvents.ActivityStats.Idle,
      },
      async () => {
        const data = await listAllTransactionsByChain(address);
        const allTransactions = Object.values(data).flatMap((d) => d.txs);
        setAllTransactions(allTransactions);

        const ethNativeTransactions: TEVMScanTransaction[] = Object.entries(
          data,
        )
          .filter(([key, _]) => key !== 'vic') // exclude VIC since it's a zero-gas fee (VN proud)
          .flatMap(([_, value]) => value.txs);

        const filteredTransactions = ethNativeTransactions.filter(
          (tx) => tx.from.toLowerCase() === address.toLowerCase(),
        );

        const totalGasInETH = filteredTransactions.reduce(
          (acc, curr) =>
            acc +
            calculateGasInETH(
              Number.parseInt(curr.gasUsed),
              Number.parseInt(curr.gasPrice),
            ),
          0,
        );

        console.log('totalGasInETH:', totalGasInETH);
        setTotalGasInETH(totalGasInETH);

        const mostActiveChainID = Object.keys(data).reduce((a, b) =>
          data[a].txs.length > data[b].txs.length ? a : b,
        );

        const mostActiveChainName = data[mostActiveChainID].chainName;

        // Get Activity Stats
        const stats = calculateEVMStreaksAndMetrics(allTransactions, address);
        console.log('Activity Stats:', stats);
        setActivityStats(stats);

        // Get chain stats
        const totalChains = Object.keys(data);
        const noActivityChains = totalChains.filter(
          (chain) => data[chain].txs.length === 0,
        );
        // Get unique active day, on most active chain 🫠
        const { uniqueActiveDays } = calculateEVMStreaksAndMetrics(
          data[mostActiveChainID].txs,
          address,
        );

        const chainStats: TChainStats = {
          totalChains,
          mostActiveChainName,
          mostActiveChainID,
          noActivityChains,
          countUniqueDaysActiveChain: uniqueActiveDays,
        };
        console.log('Chain stats:', chainStats);
        setChainStats(chainStats);

        // Get Dapp Interaction Stats
        const dappInteractionStats = calculateDappInteraction(allTransactions);
        console.log('Dapp Stats', dappInteractionStats);
        setDappInteractionStats(dappInteractionStats);

        const defiActivityStats = calculateDeFiActivityStats(allTransactions);
        console.log('DeFi', defiActivityStats);
        setDefiActivityStats(defiActivityStats);

        return stats;
      },
    );
  };

  const fetchMultichainTokenPortfolio = async (text: string) => {
    const address = await getAddress(text);
    return newAsyncDispatch(
      StateEvent.GetTokenPortfolio,
      {
        onStartEvent: StateSubEvents.GetTokenPortfolio.InProgress,
        onErrorEvent: {
          value: StateSubEvents.GetTokenPortfolio.Idle,
          toast: 'Failed to fetch multichain token portfolio.',
        },
        onFinishEvent: {
          value: StateSubEvents.GetTokenPortfolio.Finished,
          toast: 'Fetched token portfolio.',
        },
        onResetEvent: StateSubEvents.GetTokenPortfolio.Idle,
      },
      async () => {
        const tokenBalanceData = await getMultichainPortfolio(address);
        console.log('Token balance:', tokenBalanceData);

        // Get distinct token symbol with non-zero balance
        const distinctTokenSymbols = [
          ...new Set(
            tokenBalanceData
              .filter((token) => token.tokenBalance !== 0)
              .map((token) => token.symbol),
          ),
        ];
        // Get token price
        const marketData = await listCMCTokenDetail(
          distinctTokenSymbols.join(','),
        );
        console.log('Price market data:', marketData);
        setMarketData(marketData);
        setTokenPortfolio(tokenBalanceData);
      },
    );
  };

  const fetchMultichainTokenActivity = async (text: string) => {
    const address = await getAddress(text);
    return newAsyncDispatch(
      StateEvent.GetTokenActivity,
      {
        onStartEvent: StateSubEvents.GetTokenActivity.InProgress,
        onErrorEvent: {
          value: StateSubEvents.GetTokenActivity.Idle,
          toast: 'Failed to fetch multichain token activities.',
        },
        onFinishEvent: {
          value: StateSubEvents.GetTokenActivity.Finished,
          toast: 'Fetched token activities.',
        },
        onResetEvent: StateSubEvents.GetTokenActivity.Idle,
      },
      async () => {
        const tokenActivityData = await listAllTokenActivityByChain(address);
        const allTokenActivities = Object.values(tokenActivityData).flat();
        // console.log('allTokenActivities:', allTokenActivities);
        setTokenActivity(allTokenActivities);

        // Get longest holding assets
        const longestHoldingTokenByChain = Object.entries(
          tokenActivityData,
        ).map(([chain, activities]) => {
          return findLongestHoldingToken(chain, activities, address);
        });

        const longestHoldingToken = longestHoldingTokenByChain.reduce(
          (prev, current) => {
            return prev.duration > current.duration ? prev : current;
          },
        );
        if (longestHoldingToken.duration === 0) {
          console.log("You don't have any asset yet!");
        } else {
          console.log(
            `You've been loyal in holding ${longestHoldingToken.symbol} at ${longestHoldingToken.chain} for over ${formatDuration(longestHoldingToken.duration)}`,
          );
        }
        setLongestHoldingToken(longestHoldingToken);

        // TODO ---- Can we reuse the market data previously fetched?
        // Get distinct token symbol with non-zero balance
        const distinctTokenSymbols = [
          ...new Set(allTokenActivities.map((token) => token.symbol)),
        ];
        // Get token price
        const marketData = await listCMCTokenDetail(
          distinctTokenSymbols.join(','),
        );
        // End of TODO --------

        const tokenActivityStats = calculateTokenActivityStats(
          allTokenActivities,
          marketData,
        );

        setTokenActivityStats(tokenActivityStats);
        console.log('tokenActivityStats:', tokenActivityStats);
      },
    );
  };

  const fetchMultichainNftPortfolio = async (text: string) => {
    const address = await getAddress(text);
    return newAsyncDispatch(
      StateEvent.GetNftPortfolio,
      {
        onStartEvent: StateSubEvents.GetNftPortfolio.InProgress,
        onErrorEvent: {
          value: StateSubEvents.GetNftPortfolio.Idle,
          toast: 'Failed to fetch NFT portfolio.',
        },
        onFinishEvent: {
          value: StateSubEvents.GetNftPortfolio.Finished,
          toast: 'Fetched NFT portfolio.',
        },
        onResetEvent: StateSubEvents.GetNftPortfolio.Idle,
      },
      async () => {
        const data = await listAllNFTBalanceByChain(address);
        const allNFTBalance = Object.values(data).flat();
        // console.log(allNFTBalance);
        setNftPortfolio(allNFTBalance);
      },
    );
  };

  const fetchMultichainNftActivity = async (text: string) => {
    const address = await getAddress(text);
    return newAsyncDispatch(
      StateEvent.GetNftActivity,
      {
        onStartEvent: StateSubEvents.GetNftActivity.InProgress,
        onErrorEvent: {
          value: StateSubEvents.GetNftActivity.Idle,
          toast: 'Failed to fetch multichain NFT activities.',
        },
        onFinishEvent: {
          value: StateSubEvents.GetNftActivity.Finished,
          toast: 'Fetched NFT activities.',
        },
        onResetEvent: StateSubEvents.GetNftActivity.Idle,
      },
      async () => {
        const nftActivityData = await listAllNFTActivityByChain(address);
        const allNftActivities = Object.values(nftActivityData).flat();
        setNftActivity(allNftActivities);
        // console.log('allNftActivities:', allNftActivities);

        const nftActivityStats = calculateNFTActivityStats(allNftActivities);
        setNftActivityStats(nftActivityStats);
        console.log('nftActivityStats:', nftActivityStats);
      },
    );
  };

  const letsDoSomeMagic = async (addressInput: string) => {
    try {
      await newAsyncDispatch(
        StateEvent.HowBasedAreYou,
        {
          onStartEvent: StateSubEvents.HowBasedAreYou.InProgress,
          onErrorEvent: {
            value: StateSubEvents.HowBasedAreYou.Idle,
            toast: 'Magic failed!',
          },
          onFinishEvent: {
            value: StateSubEvents.HowBasedAreYou.Finished,
            toast: 'Magic done!',
          },
          onResetEvent: StateSubEvents.HowBasedAreYou.Idle,
        },
        async () => {
          await fetchBuilderScore(addressInput);
          await fetchActivityStats(addressInput);
          await fetchMultichainTokenPortfolio(addressInput);
          await fetchMultichainTokenActivity(addressInput);
          await fetchMultichainNftPortfolio(addressInput);
          await fetchMultichainNftActivity(addressInput);
          await delayMs(1000);
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    query: {
      fetchBuilderScore,
      fetchMultichainNftPortfolio,
      fetchActivityStats,
      fetchMultichainTokenPortfolio,
      fetchMultichainTokenActivity,
      fetchMultichainNftActivity,
      getAddress,
      stateCheck,
    },
    mutate: {
      letsDoSomeMagic,
      dispatchStateEvent,
      newAsyncDispatch,
    },
  };
};
