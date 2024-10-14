import MultiAssetsPortfolio from '@/components/MultiAssetsPortfolio';
import {
  calculateMultichainNFTPortfolio,
  calculateMultichainTokenPortfolio,
} from '@/helpers/portfolio.helper';
import { useWagmiConfig } from '@/wagmi';
import { getEnsAddress } from '@wagmi/core';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { normalize } from 'viem/ens';
import { delayMs, setState } from '../../helpers';
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
  listAllNFTActivityV2ByChain,
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
    inputAddress,
    talentPassportScore,
    allTransactions,
    tokenPortfolio,
    marketData,
    nftPortfolio,
    tokenActivity,
    nftActivity,

    // Insights
    longestHoldingToken,
    chainStats,
    dappInteractionStats,
    activityStats,
    defiActivityStats,
    tokenActivityStats,
    tokenPortfolioStats,
    nftActivityStats,
    nftPortfolioStats,
    totalGasInETH,
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
          setState(inputAddress)(address);
        } else {
          address = await searchAddressFromOneID(text);
          console.log('OneID Address:', address);
        }
        setState(inputAddress)(address);
        return address;
      },
    );
  };

  const fetchTalentPassportScore = async (text: string) => {
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
        setState(talentPassportScore)(data);
        return data;
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
        const _allTransactions = Object.values(data).flatMap((d) => d.txs);
        setState(allTransactions)(_allTransactions);

        const ethNativeTransactions: TEVMScanTransaction[] = Object.entries(
          data,
        )
          .filter(([key, _]) => key !== 'vic') // exclude VIC since it's a zero-gas fee (VN proud)
          .flatMap(([_, value]) => value.txs);

        const filteredTransactions = ethNativeTransactions.filter(
          (tx) => tx.from.toLowerCase() === address.toLowerCase(),
        );

        const _totalGasInETH = filteredTransactions.reduce(
          (acc, curr) =>
            acc +
            calculateGasInETH(
              Number.parseInt(curr.gasUsed),
              Number.parseInt(curr.gasPrice),
            ),
          0,
        );

        console.log('totalGasInETH:', _totalGasInETH);
        setState(totalGasInETH)(_totalGasInETH);

        const mostActiveChainID = Object.keys(data).reduce((a, b) =>
          data[a].txs.length > data[b].txs.length ? a : b,
        );

        const mostActiveChainName = data[mostActiveChainID].chainName;

        // Get Activity Stats
        const stats = calculateEVMStreaksAndMetrics(_allTransactions, address);
        console.log('Activity Stats:', stats);
        setState(activityStats)(stats);

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

        const _chainStats: TChainStats = {
          totalChains,
          mostActiveChainName,
          mostActiveChainID,
          noActivityChains,
          countUniqueDaysActiveChain: uniqueActiveDays,
        };
        console.log('Chain stats:', _chainStats);
        setState(chainStats)(_chainStats);

        // Get Dapp Interaction Stats
        const _dappInteractionStats =
          calculateDappInteraction(_allTransactions);
        // TODO: Set new stats
        console.log('Dapp Stats', _dappInteractionStats);
        setState(dappInteractionStats)(_dappInteractionStats);

        // TODO: Set new stats
        const _defiActivityStats = calculateDeFiActivityStats(_allTransactions);
        console.log('DeFi', _defiActivityStats);
        setState(defiActivityStats)(_defiActivityStats);

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
        const _marketData = await listCMCTokenDetail(
          distinctTokenSymbols.join(','),
        );
        console.log('Price market data:', _marketData);
        setState(marketData)(_marketData);
        setState(tokenPortfolio)(tokenBalanceData);

        const _tokenPortfolioStats = calculateMultichainTokenPortfolio(
          tokenBalanceData,
          _marketData,
        );
        setState(tokenPortfolioStats)(_tokenPortfolioStats);
        return MultiAssetsPortfolio;
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
        setState(tokenActivity)(allTokenActivities);

        // Get longest holding assets
        const longestHoldingTokenByChain = Object.entries(
          tokenActivityData,
        ).map(([chain, activities]) => {
          return findLongestHoldingToken(chain, activities, address);
        });

        const _longestHoldingToken = longestHoldingTokenByChain.reduce(
          (prev, current) => {
            return prev.duration > current.duration ? prev : current;
          },
        );
        if (_longestHoldingToken.duration === 0) {
          console.log("You don't have any asset yet!");
        } else {
          console.log(
            `You've been loyal in holding ${_longestHoldingToken.symbol} at ${_longestHoldingToken.chain} for over ${formatDuration(_longestHoldingToken.duration)}`,
          );
        }
        setState(longestHoldingToken)(_longestHoldingToken);

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

        const _tokenActivityStats = calculateTokenActivityStats(
          allTokenActivities,
          marketData,
        );

        // TODO: set tokenActivityStats
        setState(tokenActivityStats)(_tokenActivityStats);
        console.log('tokenActivityStats:', _tokenActivityStats);
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
        setState(nftPortfolio)(allNFTBalance);

        const _nftPortfolio = calculateMultichainNFTPortfolio(allNFTBalance);
        setState(nftPortfolioStats)(_nftPortfolio);
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
        const nftActivityData = await listAllNFTActivityV2ByChain(address);
        const allNftActivities = Object.values(nftActivityData).flat();
        setState(nftActivity)(allNftActivities);

        const _nftActivityStats = calculateNFTActivityStats(
          allNftActivities,
          address,
        );
        // TODO: set nftActivityStats
        console.log('nftActivityStats:', _nftActivityStats);
        setState(nftActivityStats)(_nftActivityStats);
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
          await fetchTalentPassportScore(addressInput);
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

  useEffect(() => {}, []);

  return {
    query: {
      fetchTalentPassportScore,
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
