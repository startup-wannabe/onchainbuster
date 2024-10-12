'use client';
import React, { useState } from 'react';
import type { StateEventRegistry } from '../state.type';

const defaultActivityStats: TActivityStats = {
  totalTxs: 0,
  firstActiveDay: null,
  uniqueActiveDays: 0,
  uniqueActiveDays12M: 0,
  uniqueActiveDays6M: 0,
  uniqueActiveDays3M: 0,
  longestStreakDays: 0,
  currentStreakDays: 0,
  activityPeriod: 0,
};

const defaultDeFiActivityStats: TDeFiActivityStats = {
  sumCount: 0,
  lendCount: 0,
  swapCount: 0,
};

const defaultTokenActivityStats: TTokenActivityStats = {
  sumCount: 0,
  newCount: 0,
};

const defaultNFTActivityStats: TNFTActivityStats = {
  sumCount: 0,
  tradeCount: 0,
};

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type UseState<T> = [T, SetState<T>];

interface IMagicContext {
  stateEvents: StateEventRegistry;
  setStateEvents: SetState<StateEventRegistry>;
  // Data analytics states
  text: UseState<string>;
  inputAddress: UseState<string>;

  // Raw
  allTransactions: UseState<TEVMScanTransaction[]>;
  marketData: UseState<TTokenSymbolDetail[]>;
  tokenPortfolio: UseState<TTokenBalance[]>;
  nftPortfolio: UseState<TNFTBalance[]>;
  tokenActivity: UseState<TTokenActivity[]>;
  nftActivity: UseState<TNFTActivity[]>;

  // Insights
  mostActiveChain: UseState<string>;
  activityStats: UseState<TActivityStats>;
  defiActivityStats: UseState<TDeFiActivityStats>;
  tokenActivityStats: UseState<TTokenActivityStats>;
  nftActivityStats: UseState<TNFTActivityStats>;
}

export const MagicContext = React.createContext<IMagicContext>(
  undefined as any,
);

interface Props {
  children: React.ReactElement | React.ReactNode;
}

export const MagicProvider = ({ children }: Props) => {
  const [stateEvents, setStateEvents] = useState<StateEventRegistry>({});

  const inputAddress = useState('');
  // TODO: REMOVE when we're done.
  const MOCK_WALLET_ADDRESS = '0x294d404b2d2A46DAb65d0256c5ADC34C901A6842';
  const text = useState(MOCK_WALLET_ADDRESS);

  // All transactions and activity stats
  const allTransactions = useState<TEVMScanTransaction[]>([]);
  const activityStats = useState<TActivityStats>(defaultActivityStats);
  const defiActivityStats = useState<TDeFiActivityStats>(
    defaultDeFiActivityStats,
  );
  const tokenActivityStats = useState<TTokenActivityStats>(
    defaultTokenActivityStats,
  );
  const nftActivityStats = useState<TNFTActivityStats>(defaultNFTActivityStats);
  const mostActiveChain = useState('');

  // Multi-chain token portfolio
  const tokenPortfolio = useState<TTokenBalance[]>([]);
  const marketData = useState<TTokenSymbolDetail[]>([]);

  // Multi-chain nft portfolio
  const nftPortfolio = useState<TNFTBalance[]>([]);

  // Multi-chain token & activity
  const tokenActivity = useState<TTokenActivity[]>([]);
  const nftActivity = useState<TNFTActivity[]>([]);

  return (
    <MagicContext.Provider
      value={{
        stateEvents,
        setStateEvents,

        // Raw
        text,
        inputAddress,
        allTransactions,
        tokenPortfolio,
        marketData,
        tokenActivity,
        nftPortfolio,
        nftActivity,

        // Insight
        activityStats,
        mostActiveChain,
        defiActivityStats,
        tokenActivityStats,
        nftActivityStats,
      }}
    >
      {children}
    </MagicContext.Provider>
  );
};
