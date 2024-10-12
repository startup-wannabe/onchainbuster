import {
  BinaryState,
  StateEvent,
  StateOption,
  ThreeStageState,
  Toastable,
} from '../state.type';
import { toast } from 'react-toastify';
import { listCMCTokenDetail } from '../api/cmcCallers';
import { getEnsAddress } from '@wagmi/core';
import { useWagmiConfig } from '@/wagmi';
import {
  getMultichainPortfolio,
  listAllNFTBalanceByChain,
  listAllTransactionsByChain,
} from '../api/services';
import { normalize } from 'viem/ens';
import { searchAddressFromOneID } from '../api/victionCallers';
import { delayMs } from '../../helpers';
import { calculateEVMStreaksAndMetrics } from '../../helpers/activity.helper';
import { useMagicContext } from './useMagicContext';

export const StateSubEvents = {
  [StateEvent.HowBasedAreYou]: ThreeStageState,
  [StateEvent.ActivityStats]: ThreeStageState,
  [StateEvent.GetAddress]: BinaryState,
  [StateEvent.GetTokenPortfolio]: ThreeStageState,
};

export const useMagic = () => {
  const {} = useMagic;
  const wagmiConfig = useWagmiConfig();
  const {
    stateEvents,
    setStateEvents,
    allTransactions: [, setAllTransactions],
    inputAddress: [, setInputAddress],
    mostActiveChain: [, setMostActiveChain],
    activityStats: [, setActivityStats],
    tokenPortfolio: [, setTokenPortfolio],
    marketData: [, setMarketData],
    nftPortfolio: [, setNftPortfolio],
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
        console.log('evmTransactions:', data);
        const allTransactions = Object.values(data).flat();
        setAllTransactions(allTransactions);
        const mostActiveChain = Object.keys(data).reduce((a, b) =>
          data[a].length > data[b].length ? a : b,
        );
        setMostActiveChain(mostActiveChain);
        const stats = calculateEVMStreaksAndMetrics(
          data[mostActiveChain],
          address,
        );
        setActivityStats(stats);
        console.log('Activity Stats:', stats);
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
        console.log(tokenBalanceData);
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
        console.log(marketData);
        setMarketData(marketData);
        setTokenPortfolio(tokenBalanceData);
      },
    );
  };

  const fetchMultichainNFTPortfolio = async (text: string) => {
    const address = await getAddress(text);
    return newAsyncDispatch(
      StateEvent.GetTokenPortfolio,
      {
        onStartEvent: StateSubEvents.GetTokenPortfolio.InProgress,
        onErrorEvent: {
          value: StateSubEvents.GetTokenPortfolio.Idle,
          toast: 'Failed to fetch NFT portfolio.',
        },
        onFinishEvent: {
          value: StateSubEvents.GetTokenPortfolio.Finished,
          toast: 'Fetched token portfolio.',
        },
        onResetEvent: StateSubEvents.GetTokenPortfolio.Idle,
      },
      async () => {
        const data = await listAllNFTBalanceByChain(address);
        const allNFTBalance = Object.values(data).flat();
        console.log(allNFTBalance);
        setNftPortfolio(allNFTBalance);
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
          await fetchMultichainTokenPortfolio(addressInput);
          await delayMs(1000);
        },
      );
      // await fetchMultichainNFTPortfolio(addressInput);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    query: {
      fetchMultichainNFTPortfolio,
      fetchActivityStats,
      fetchMultichainTokenPortfolio,
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
