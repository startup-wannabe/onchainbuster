'use client';
import React, { useState } from 'react';
import { StateEventRegistry } from '../state.type';

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

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type UseState<T> = [T, SetState<T>];

interface IMagicContext {
  stateEvents: StateEventRegistry;
  setStateEvents: SetState<StateEventRegistry>;
  // Data analytics states
  text: UseState<string>;
  inputAddress: UseState<string>;
  activityStats: UseState<TActivityStats>;
  mostActiveChain: UseState<string>;
  tokenPortfolio: UseState<TTokenBalance[]>;
  marketData: UseState<TTokenSymbolDetail[]>;
  nftPortfolio: UseState<TNFTBalance[]>;
  allTransactions: UseState<TEVMScanTransaction[]>;
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
  const mostActiveChain = useState('');
  // Multi-chain token portfolio
  const tokenPortfolio = useState<TTokenBalance[]>([]);
  const marketData = useState<TTokenSymbolDetail[]>([]);

  // Multi-chain nft portfolio
  const nftPortfolio = useState<TNFTBalance[]>([]);

  return (
    <MagicContext.Provider
      value={{
        stateEvents,
        setStateEvents,
        allTransactions,
        inputAddress,
        activityStats,
        marketData,
        mostActiveChain,
        nftPortfolio,
        tokenPortfolio,
        text,
      }}
    >
      {children}
    </MagicContext.Provider>
  );
};
