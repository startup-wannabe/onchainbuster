import { useWagmiConfig } from '@/wagmi';
import { getEnsAddress } from '@wagmi/core';
import { toast } from 'react-toastify';
import { normalize } from 'viem/ens';
import { delayMs } from '../../helpers';
import {
  calculateDappInteraction,
  calculateDeFiActivityStats,
  calculateEVMStreaksAndMetrics,
  calculateNFTActivityStats,
  calculateTokenActivityStats,
  findLongestHoldingAsset,
  formatDuration,
} from '../../helpers/activity.helper';
import { listCMCTokenDetail } from '../api/cmcCallers';
import {
  getMultichainPortfolio,
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
    allTransactions: [, setAllTransactions],

    tokenPortfolio: [, setTokenPortfolio],
    marketData: [, setMarketData],
    nftPortfolio: [, setNftPortfolio],
    tokenActivity: [, setTokenActivity],
    nftActivity: [, setNftActivity],

    // Insights
    mostActiveChain: [, setMostActiveChain],
    activityStats: [, setActivityStats],
    defiActivityStats: [, setDefiActivityStats],
    tokenActivityStats: [, setTokenActivityStats],
    nftActivityStats: [, setNftActivityStats],
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
      if (event.toast)
        toast(event.toast, {
          type: 'success',
        });
      return data;
    } catch (error: any) {
      const event = eventHooks.onErrorEvent;
      dispatchStateEvent(eventName, event.value);
      if (event.toast)
        toast(`${event.toast} - Error: ${error.message}`, {
          type: 'error',
        });
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
        const allTransactions = Object.values(data).flat();
        setAllTransactions(allTransactions);

        // Get Most Active Chain
        const mostActiveChain = Object.keys(data).reduce((a, b) =>
          data[a].length > data[b].length ? a : b,
        );
        setMostActiveChain(mostActiveChain);

        // Get Activity Stats
        const stats = calculateEVMStreaksAndMetrics(allTransactions, address);
        console.log('Activity Stats:', stats);
        setActivityStats(stats);

        // Get Dapp Interaction Stats
        const dappInteractionStats = calculateDappInteraction(allTransactions);
        // TODO: Set new stats
        console.log('Dapp Stats', dappInteractionStats);

        // TODO: Set new stats
        const defiActivityStats = calculateDeFiActivityStats(allTransactions);
        setDefiActivityStats(defiActivityStats);
        console.log('DeFi', defiActivityStats);

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
        // console.log(tokenBalanceData);
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
        // console.log(marketData);
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
        const longestHoldingAssetByChain = Object.entries(
          tokenActivityData,
        ).map(([chain, activities]) => {
          return findLongestHoldingAsset(chain, activities, address);
        });

        const longestHoldingAsset = longestHoldingAssetByChain.reduce(
          (prev, current) => {
            return prev.duration > current.duration ? prev : current;
          },
        );
        if (longestHoldingAsset.duration === 0) {
          console.log("You don't have any asset yet!");
        } else {
          console.log(
            `You've been loyal in holding ${longestHoldingAsset.symbol} at ${longestHoldingAsset.chain} for over ${formatDuration(longestHoldingAsset.duration)}`,
          );
        }

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

        // TODO: set tokenActivityStats
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
        // TODO: set nftActivityStats
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
          await fetchActivityStats(addressInput);
          // await fetchMultichainTokenPortfolio(addressInput);
          await fetchMultichainTokenActivity(addressInput);
          // await fetchMultichainNftPortfolio(addressInput);
          // await fetchMultichainNftActivity(addressInput);
          await delayMs(1000);
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    query: {
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
