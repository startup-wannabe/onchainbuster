'use client';
import BaseSvg from '@/assets/svg/BaseSvg';
import ActivityStats from '@/components/ActivityStats';
import LoadableContainer from '@/components/LoadableContainer';
import MagicButton from '@/components/MagicButton';
import TokenPortfolio from '@/components/TokenPortfolio';
import { ONCHAINKIT_LINK } from '@/constants/links';
import { calculateEVMStreaksAndMetrics } from '@/helpers/activity.helper';
import { useWagmiConfig } from '@/wagmi';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Spinner, TextField } from '@radix-ui/themes';
import { getEnsAddress } from '@wagmi/core';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { normalize } from 'viem/ens';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';
import { listCMCTokenDetail } from './api/cmcCallers';
import {
  getMultichainPortfolio,
  listAllNFTActivityByChain,
  listAllNFTBalanceByChain,
  listAllTokenActivityByChain,
  listAllTransactionsByChain,
} from './api/services';
import { searchAddressFromOneID } from './api/victionCallers';
import {
  BinaryState,
  StateEvent,
  type StateEventRegistry,
  type StateOption,
  ThreeStageState,
} from './state.type';

// TODO: Remove this when ready.
const MOCK_WALLET_ADDRESS = '0x294d404b2d2A46DAb65d0256c5ADC34C901A6842';

export const StateSubEvents = {
  [StateEvent.HowBasedAreYou]: ThreeStageState,
  [StateEvent.ActivityStats]: ThreeStageState,
  [StateEvent.GetAddress]: BinaryState,
  [StateEvent.GetTokenPortfolio]: ThreeStageState,
};

export default function Page() {
  const [stateEvents, setStateEvents] = useState<StateEventRegistry>({});
  const { address } = useAccount();
  const wagmiConfig = useWagmiConfig();
  // TODO: Remove the mock value when ready.
  const [addressInput, setAddressInput] = useState(MOCK_WALLET_ADDRESS);
  const [inputAddress, setInputAddress] = useState('');
  // All transactions and activity stats
  const [allTransactions, setAllTransactions] = useState<TEVMScanTransaction[]>(
    [],
  );
  const [activityStats, setActivityStats] = useState<TActivityStats>({
    totalTxs: 0,
    firstActiveDay: null,
    uniqueActiveDays: 0,
    uniqueActiveDays12M: 0,
    uniqueActiveDays6M: 0,
    uniqueActiveDays3M: 0,
    longestStreakDays: 0,
    currentStreakDays: 0,
    activityPeriod: 0,
  });
  const [mostActiveChain, setMostActiveChain] = useState('');
  // Multi-chain token portfolio
  const [tokenPortfolio, setTokenPortfolio] = useState<TTokenBalance[]>([]);
  const [marketData, setMarketData] = useState<TTokenSymbolDetail[]>([]);

  // Multi-chain nft portfolio
  const [nftPortfolio, setNftPortfolio] = useState<TNFTBalance[]>([]);
  const dispatchStateEvent = (eventName: StateEvent, status: StateOption) => {
    setStateEvents((stateEvents) => {
      stateEvents[eventName] = status;
      return stateEvents;
    });
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
      onFinishEvent: StateOption;
      onErrorEvent: StateOption;
      onResetEvent: StateOption;
    },
    method: () => Promise<Output>,
    toastContent?: string,
  ): Promise<Output> {
    dispatchStateEvent(eventName, eventHooks.onResetEvent);
    dispatchStateEvent(eventName, eventHooks.onStartEvent);
    try {
      const data = await method();
      if (toastContent) {
        toast(toastContent);
      }
      dispatchStateEvent(eventName, eventHooks.onFinishEvent);
      return data;
    } catch (error: any) {
      dispatchStateEvent(eventName, eventHooks.onErrorEvent);
      throw new Error(error);
    }
  }

  const getAddress = async (text: string) => {
    return newAsyncDispatch(
      StateEvent.GetAddress,
      {
        onStartEvent: StateSubEvents.GetAddress.True,
        onErrorEvent: StateSubEvents.GetAddress.False,
        onFinishEvent: StateSubEvents.GetAddress.False,
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
        onErrorEvent: StateSubEvents.ActivityStats.Idle,
        onFinishEvent: StateSubEvents.ActivityStats.Finished,
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
      'Activity stats fetched.',
    );
  };

  const fetchMultichainTokenPortfolio = async (text: string) => {
    const address = await getAddress(text);
    return newAsyncDispatch(
      StateEvent.GetTokenPortfolio,
      {
        onStartEvent: StateSubEvents.GetTokenPortfolio.InProgress,
        onErrorEvent: StateSubEvents.GetTokenPortfolio.Idle,
        onFinishEvent: StateSubEvents.GetTokenPortfolio.Finished,
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
      'Fetched token portfolio.',
    );
  };

  const fetchMultichainNFTPortfolio = async (text: string) => {
    const address = await getAddress(text);
    return newAsyncDispatch(
      StateEvent.GetTokenPortfolio,
      {
        onStartEvent: StateSubEvents.GetTokenPortfolio.InProgress,
        onErrorEvent: StateSubEvents.GetTokenPortfolio.Idle,
        onFinishEvent: StateSubEvents.GetTokenPortfolio.Finished,
        onResetEvent: StateSubEvents.GetTokenPortfolio.Idle,
      },
      async () => {
        const data = await listAllNFTBalanceByChain(address);
        const allNFTBalance = Object.values(data).flat();
        console.log(allNFTBalance);
        setNftPortfolio(allNFTBalance);
      },
      'Fetched token portfolio.',
    );
  };

  const letsDoSomeMagic = async () => {
    return newAsyncDispatch(
      StateEvent.HowBasedAreYou,
      {
        onStartEvent: StateSubEvents.HowBasedAreYou.InProgress,
        onErrorEvent: StateSubEvents.HowBasedAreYou.Idle,
        onFinishEvent: StateSubEvents.HowBasedAreYou.Finished,
        onResetEvent: StateSubEvents.HowBasedAreYou.Idle,
      },
      async () => {
        await fetchActivityStats(addressInput);
        await fetchMultichainTokenPortfolio(addressInput);
        // await fetchMultichainNFTPortfolio(addressInput);
      },
    );
  };

  const handleSearchAllNFTActivity = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllNFTActivityByChain(address);
    console.log('nftActivity:', data);
  };

  const handleSearchAllTokenActivity = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllTokenActivityByChain(address);
    console.log('tokenActivity:', data);
  };

  return (
    <div className="flex w-100 max-w-full flex-col px-1 md:w-[1200px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <a
            href={ONCHAINKIT_LINK}
            title="onchainkit"
            target="_blank"
            rel="noreferrer"
          >
            <BaseSvg />
          </a>
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 rounded-xl px-2 py-10 md:grow">
        <h1 className="inline-flex text-4xl mb-6">
          How
          <span className="flex mx-2 font-bold">
            <BaseSvg width={40} height={40} />{' '}
            <span style={{ marginLeft: 5 }}>Based</span>
          </span>{' '}
          are you?
        </h1>
        <TextField.Root
          className="mr-2 w-full rounded-md p-2 shadow-xl"
          placeholder="ENS, Basename, OneID, 0x..."
          style={{
            borderRadius: 50,
            height: '70px',
            maxWidth: '900px',
            border: '1px solid lightgray',
          }}
          size={'3'}
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="20" width="20" />
          </TextField.Slot>
          <TextField.Slot>
            {address && (
              <MagicButton
                text="🧑‍💻 My wallet"
                className="bg-white text-black hover:text-white"
                onClick={() => setAddressInput(address)}
              />
            )}
            <MagicButton
              text="Let's go 🔥"
              onClick={letsDoSomeMagic}
              loading={stateCheck('HowBasedAreYou', ThreeStageState.InProgress)}
            />
          </TextField.Slot>
        </TextField.Root>
        {inputAddress !== '' ? (
          <p className="text-md">Your EVM address: {inputAddress}</p>
        ) : (
          <p className="text-md">Address not found</p>
        )}
        <div className="flex flex-row flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleSearchAllTokenActivity(addressInput)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM Token Activity
          </button>
          <button
            type="button"
            onClick={() => handleSearchAllNFTActivity(addressInput)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM NFT Activity
          </button>
        </div>
      </section>
      {stateCheck('ActivityStats', ThreeStageState.Finished) && (
        <div className="mt-8">
          <div className="flex items-center justify-center">
            <h2 className="mb-4 font-bold text-2xl">Activity Statistics</h2>
          </div>
          <LoadableContainer
            isLoading={stateCheck('ActivityStats', ThreeStageState.InProgress)}
            loadComponent={<Spinner />}
          >
            {allTransactions.length > 0 && (
              <ActivityStats
                transactions={allTransactions}
                activityStats={activityStats}
                mostActiveChain={mostActiveChain}
              />
            )}
          </LoadableContainer>
        </div>
      )}
      {stateCheck('GetTokenPortfolio', ThreeStageState.Finished) && (
        <div className="mt-8">
          <div className="flex items-center justify-center">
            <h2 className="mb-4 font-bold text-2xl">Token Portfolio</h2>
          </div>
          {tokenPortfolio.length > 0 && (
            <TokenPortfolio
              tokenPortfolio={tokenPortfolio}
              marketData={marketData}
            />
          )}
        </div>
      )}
    </div>
  );
}
