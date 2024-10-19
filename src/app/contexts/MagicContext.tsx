'use client';
import React, { useRef, useState } from 'react';
import type { StateEventRegistry } from '../state.type';

export enum BackgroundVariant {
  Image = 'Background Image',
  Color = 'Background Color',
}

const defaultActivityStats: TActivityStats = {
  totalTxs: 0,
  firstActiveDay: null,
  uniqueActiveDays: 0,
  longestStreakDays: 0,
  currentStreakDays: 0,
  activityPeriod: 0,
};

const defaultLongestHoldingToken: TLongestHoldingToken = {
  chain: '',
  chainLogoURI: '',
  symbol: '',
  duration: 0,
};

const defaultDeFiActivityStats: TDeFiActivityStats = {
  sumCount: 0,
  lendCount: 0,
  swapCount: 0,
  dexCount: 0,
};

const defaultTokenActivityStats: TTokenActivityStats = {
  sumCount: 0,
  newCount: 0,
};

const defaultTokenPortfolioStats: TTokenPortfolioStats = {
  aggregatedBalanceBySymbol: {},
  chainCircularPackingData: {
    type: 'leaf',
    name: '',
    value: 0,
  },
  chainRecordsWithTokens: {},
  mostValuableToken: {
    name: '',
    symbol: '',
    value: 0,
    logoURI: '',
  },
  sumMemeUSDValue: 0,
  sumPortfolioUSDValue: 0,
};

const defaultNftPortfolioStats: TNFTPortfolioStats = {
  mostValuableNFTCollection: {
    chain: '',
    collectionAddress: '',
    collectionImage: '',
    collectionName: '',
    floorPrice: 0,
    totalCount: 0,
    totalValue: 0,
  },
  sumPortfolioUSDValue: 0,
  chainRecordsWithTokens: {},
};

const defaultChainStats: TChainStats = {
  totalChains: [],
  noActivityChains: [],
  mostActiveChainID: '',
  mostActiveChainName: '',
  countUniqueDaysActiveChain: 0,
  countActiveChainTxs: 0,
};

const defaultDappInteractionStats: TDAppInteractionMap = {
  marketplace: {},
  defi: {},
  bridge: {},
  nameService: {},
};

const defaultNFTActivityStats: TNFTActivityStats = {
  sumCount: 0,
  mintCount: 0,
  buyCount: 0,
  saleCount: 0,
  tradeCount: 0,
};

const defaultTalentPassportScore: TTalentPassportScore = {
  activity_score: 0,
  identity_score: 0,
  skills_score: 0,
};

export enum AppStage {
  DisplayProfile = 0,
  GetBased = 1,
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type UseState<T> = [T, SetState<T>];

interface IMagicContext {
  appStage: UseState<AppStage>;
  stateEvents: StateEventRegistry;
  setStateEvents: SetState<StateEventRegistry>;
  nftTemplateSetting: UseState<TNftTemplateSetting>;

  // Data analytics states
  text: UseState<string>;
  inputAddress: UseState<string>;
  talentPassportScore: UseState<TTalentPassportScore>;

  // Raw
  allTransactions: UseState<TEVMScanTransaction[]>;
  marketData: UseState<TTokenSymbolDetail[]>;
  tokenPortfolio: UseState<TTokenBalance[]>;
  nftPortfolio: UseState<TNFTBalance[]>;
  tokenActivity: UseState<TTokenActivity[]>;
  nftActivity: UseState<TNFTActivityV2[]>;

  // Insights
  longestHoldingToken: UseState<TLongestHoldingToken>;
  chainStats: UseState<TChainStats>;
  dappInteractionStats: UseState<TDAppInteractionMap>;
  activityStats: UseState<TActivityStats>;
  defiActivityStats: UseState<TDeFiActivityStats>;
  tokenPortfolioStats: UseState<TTokenPortfolioStats>;
  tokenActivityStats: UseState<TTokenActivityStats>;
  nftActivityStats: UseState<TNFTActivityStats>;
  totalGasInETH: UseState<number>;
  nftPortfolioStats: UseState<TNFTPortfolioStats>;
}

export const MagicContext = React.createContext<IMagicContext>(
  undefined as any,
);

interface Props {
  children: React.ReactElement | React.ReactNode;
}

export const MagicProvider = ({ children }: Props) => {
  const [stateEvents, setStateEvents] = useState<StateEventRegistry>({});
  const ref = useRef<React.MutableRefObject<HTMLDivElement> | undefined>(
    undefined,
  );
  const nftTemplateSetting = useState<TNftTemplateSetting>({
    ref: ref.current,
    backgroundValue: '/background.avif',
    backgroundType: BackgroundVariant.Image,
  });

  const inputAddress = useState('');
  // TODO: REMOVE when we're done.
  const MOCK_WALLET_ADDRESS = '0x6A62d8402ABf362569Ed8eC3b2E78D8b74c9E15b';
  const text = useState(MOCK_WALLET_ADDRESS);

  const appStage = useState<AppStage>(AppStage.DisplayProfile);
  // All transactions and activity stats
  const allTransactions = useState<TEVMScanTransaction[]>([]);
  const activityStats = useState<TActivityStats>(defaultActivityStats);
  const longestHoldingToken = useState<TLongestHoldingToken>(
    defaultLongestHoldingToken,
  );
  const talentPassportScore = useState<TTalentPassportScore>(
    defaultTalentPassportScore,
  );
  const defiActivityStats = useState<TDeFiActivityStats>(
    defaultDeFiActivityStats,
  );
  const tokenActivityStats = useState<TTokenActivityStats>(
    defaultTokenActivityStats,
  );
  const nftActivityStats = useState<TNFTActivityStats>(defaultNFTActivityStats);
  const chainStats = useState<TChainStats>(defaultChainStats);
  const dappInteractionStats = useState<TDAppInteractionMap>(
    defaultDappInteractionStats,
  );

  // Multi-chain token portfolio
  const tokenPortfolio = useState<TTokenBalance[]>([]);
  const tokenPortfolioStats = useState<TTokenPortfolioStats>(
    defaultTokenPortfolioStats,
  );
  const marketData = useState<TTokenSymbolDetail[]>([]);

  // Multi-chain nft portfolio
  const nftPortfolio = useState<TNFTBalance[]>([]);
  const nftPortfolioStats = useState<TNFTPortfolioStats>(
    defaultNftPortfolioStats,
  );

  // Multi-chain token & activity
  const tokenActivity = useState<TTokenActivity[]>([]);
  const nftActivity = useState<TNFTActivityV2[]>([]);

  const totalGasInETH = useState(0);
  return (
    <MagicContext.Provider
      value={{
        appStage,
        stateEvents,
        setStateEvents,
        nftTemplateSetting,

        // Raw
        text,
        inputAddress,
        talentPassportScore,
        allTransactions,
        tokenPortfolio,
        tokenPortfolioStats,
        marketData,
        tokenActivity,
        nftPortfolio,
        nftPortfolioStats,
        nftActivity,

        // Insight
        activityStats,
        longestHoldingToken,
        dappInteractionStats,
        chainStats,
        defiActivityStats,
        tokenActivityStats,
        nftActivityStats,
        totalGasInETH,
      }}
    >
      {children}
    </MagicContext.Provider>
  );
};
