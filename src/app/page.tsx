"use client";
import BaseSvg from "@/assets/svg/BaseSvg";
import ActivityStats from "@/components/ActivityStats";
import TokenPortfolio from "@/components/TokenPortfolio";
import { ONCHAINKIT_LINK } from "@/constants/links";
import { calculateEVMStreaksAndMetrics } from "@/helpers/activity.helper";
import { useWagmiConfig } from "@/wagmi";
import { getEnsAddress } from "@wagmi/core";
import { useRef, useState } from "react";
import Footer from "src/components/Footer";
import { normalize } from "viem/ens";
import { useAccount } from "wagmi";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";
import { listCMCTokenDetail } from "./api/cmcCallers";
import {
  getMultichainPortfolio,
  listAllNFTActivityByChain,
  listAllNFTBalanceByChain,
  listAllTokenActivityByChain,
  listAllTransactionsByChain,
} from "./api/services";
import { searchAddressFromOneID } from "./api/victionCallers";
import LoadableContainer from "@/components/LoadableContainer";
import { Skeleton, Spinner } from "@radix-ui/themes";
import { mustBeBoolean } from "@/helpers";
import { toast } from "react-toastify";

// TODO: Remove this when ready.
const MOCK_WALLET_ADDRESS = "0x294d404b2d2A46DAb65d0256c5ADC34C901A6842";

enum StateEvents {
  GetAddress = "GetAddress",
  ActivityStats = "ActivityStats",
}

type StateEventRegistry = Partial<Record<StateEvents, boolean>>;

export default function Page() {
  const [stateEvents, setStateEvents] = useState<StateEventRegistry>({});
  const { address } = useAccount();
  const wagmiConfig = useWagmiConfig();
  // TODO: Remove the mock value when ready.
  const [addressInput, setAddressInput] = useState(MOCK_WALLET_ADDRESS);
  const [inputAddress, setInputAddress] = useState("");
  // All transactions and activity stats
  const [allTransactions, setAllTransactions] = useState<TEVMScanTransaction[]>(
    []
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
  const [mostActiveChain, setMostActiveChain] = useState("");
  // Multi-chain token portfolio
  const [tokenPortfolio, setTokenPortfolio] = useState<TTokenBalance[]>([]);
  const [marketData, setMarketData] = useState<TTokenSymbolDetail[]>([]);

  const dispatchStateEvent = (eventName: StateEvents, status: boolean) => {
    setStateEvents({ ...stateEvents, [eventName]: status });
  };

  async function newAsyncDispatch<Output>(
    eventName: StateEvents,
    method: () => Promise<Output>,
    toastContent?: string
  ): Promise<Output> {
    dispatchStateEvent(eventName, true);
    try {
      const data = await method();
      dispatchStateEvent(eventName, false);
      if (toastContent) toast(toastContent);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  const getAddress = async (text: string) => {
    return newAsyncDispatch(StateEvents.GetAddress, async () => {
      let address = "";
      if (text.startsWith("0x")) {
        address = text;
      } else if (text.endsWith(".eth")) {
        address = (await getEnsAddress(wagmiConfig, {
          name: normalize(text),
          chainId: 1,
        })) as string;
        console.log("ENS Address:", address);
      } else {
        address = await searchAddressFromOneID(text);
        console.log("OneID Address:", address);
      }
      setInputAddress(address);
      return address;
    });
  };

  const fetchActivityStats = async (addressInput: string) => {
    const address = await getAddress(addressInput);
    return newAsyncDispatch(
      StateEvents.ActivityStats,
      async () => {
        const data = await listAllTransactionsByChain(address);
        console.log("evmTransactions:", data);
        const allTransactions = Object.values(data).flat();
        setAllTransactions(allTransactions);
        const mostActiveChain = Object.keys(data).reduce((a, b) =>
          data[a].length > data[b].length ? a : b
        );
        setMostActiveChain(mostActiveChain);
        const stats = calculateEVMStreaksAndMetrics(
          data[mostActiveChain],
          address
        );
        setActivityStats(stats);
        console.log("Activity Stats:", stats);
        return stats;
      },
      "Activity stats fetched!"
    );
  };

  const fetchMultichainTokenPortfolio = async (text: string) => {
    const address = await getAddress(text);
    const tokenBalanceData = await getMultichainPortfolio(address);
    console.log(tokenBalanceData);
    // Get distinct token symbol with non-zero balance
    const distinctTokenSymbols = [
      ...new Set(
        tokenBalanceData
          .filter((token) => token.tokenBalance !== 0)
          .map((token) => token.symbol)
      ),
    ];

    // Get token price
    const marketData = await listCMCTokenDetail(distinctTokenSymbols.join(","));
    console.log(marketData);
    setMarketData(marketData);
    setTokenPortfolio(tokenBalanceData);
  };

  // Raw API functions (testing only - remove later)
  const handleSearchAllNFTBalance = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllNFTBalanceByChain(address);
    console.log("nftBalance:", data);
  };

  const handleSearchAllNFTActivity = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllNFTActivityByChain(address);
    console.log("nftActivity:", data);
  };

  const handleSearchAllTokenActivity = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllTokenActivityByChain(address);
    console.log("tokenActivity:", data);
  };

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
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
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 rounded-xl px-2 py-4 md:grow">
        <input
          type="text"
          placeholder="EVM address 0x..., ENS, Basename, OneID"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          className="mr-2 w-full rounded-md border border-gray-300 p-2"
        />
        {inputAddress !== "" ? (
          <p>Your EVM address: {inputAddress}</p>
        ) : (
          <p>Address not found</p>
        )}
        <div className="flex flex-row flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleSearchAllTokenActivity(addressInput)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM Token Activity
          </button>
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleSearchAllNFTBalance(addressInput)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM NFT Balance
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
      {/* Activiy Stats */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 font-bold text-2xl">Activity Statistics</h2>
          <button
            type="button"
            onClick={() => fetchActivityStats(addressInput)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            <Spinner
              size={"3"}
              loading={mustBeBoolean(stateEvents.ActivityStats)}
            >
              Get Stats
            </Spinner>
          </button>
        </div>
        <LoadableContainer
          isLoading={stateEvents.ActivityStats}
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
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 font-bold text-2xl">Token Portfolio</h2>
          <button
            type="button"
            onClick={() => fetchMultichainTokenPortfolio(addressInput)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Get Portfolio
          </button>
        </div>
        {tokenPortfolio.length > 0 && (
          <TokenPortfolio
            tokenPortfolio={tokenPortfolio}
            marketData={marketData}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
