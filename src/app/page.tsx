'use client';
import BaseSvg from '@/assets/svg/BaseSvg';
import ActivityStats from '@/components/ActivityStats';
import { ONCHAINKIT_LINK } from '@/constants/links';
import { calculateEVMStreaksAndMetrics } from '@/helpers/activity.helper';
import { useWagmiConfig } from '@/wagmi';
import { getEnsAddress } from '@wagmi/core';
import { useState } from 'react';
import Footer from 'src/components/Footer';
import { normalize } from 'viem/ens';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';
import {
  getAllANativeTokenByChain,
  listAllNFTActivityByChain,
  listAllNFTBalanceByChain,
  listAllTokenActivityByChain,
  listAllTokenBalanceByChain,
  listAllTransactionsByChain,
} from './api/services';
import { searchAddressFromOneID } from './api/victionCallers';

export default function Page() {
  const { address } = useAccount();

  const wagmiConfig = useWagmiConfig();

  const [text, setText] = useState('');
  const [inputAddress, setInputAddress] = useState('');

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

  const getAddress = async (text: string) => {
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
  };

  const fetchActivityStats = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllTransactionsByChain(address);
    console.log('evmTransactions:', data);
    const allTransactions = Object.values(data).flat();
    setAllTransactions(allTransactions);
    const mostActiveChain = Object.keys(data).reduce((a, b) =>
      data[a].length > data[b].length ? a : b,
    );
    setMostActiveChain(mostActiveChain);
    const stats = calculateEVMStreaksAndMetrics(data[mostActiveChain], address);
    setActivityStats(stats);
    console.log('Activity Stats:', stats);
  };

  // Raw API functions (testing only - remove later)
  const handleSearchAllExplorers = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllTransactionsByChain(address);
    console.log('evmTransactions:', data);
  };

  const handleSearchAllNFTBalance = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllNFTBalanceByChain(address);
    console.log('nftBalance:', data);
  };

  const handleSearchAllNFTActivity = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllNFTActivityByChain(address);
    console.log('nftActivity:', data);
  };

  const handleSearchAllTokenBalance = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllTokenBalanceByChain(address);
    console.log('tokenBalance:', data);
  };

  const handleSearchAllTokenActivity = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllTokenActivityByChain(address);
    console.log('tokenActivity:', data);
  };

  const handleSearchAllNativeTokenBalance = async (text: string) => {
    const address = await getAddress(text);
    const data = await getAllANativeTokenByChain(address);
    console.log('accountNativeBalance:', data);
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mr-2 w-full rounded-md border border-gray-300 p-2"
        />
        {inputAddress !== '' ? (
          <p>Your EVM address: {inputAddress}</p>
        ) : (
          <p>Address not found</p>
        )}

        <div className="flex flex-row flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleSearchAllNativeTokenBalance(text)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM Native Balance
          </button>

          <button
            type="button"
            onClick={() => handleSearchAllExplorers(text)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM Transactions
          </button>
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleSearchAllTokenActivity(text)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM Token Activity
          </button>

          <button
            type="button"
            onClick={() => handleSearchAllTokenBalance(text)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM Token Balance
          </button>
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleSearchAllNFTBalance(text)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Multi-EVM NFT Balance
          </button>

          <button
            type="button"
            onClick={() => handleSearchAllNFTActivity(text)}
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
            onClick={() => fetchActivityStats(text)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Get Stats
          </button>
        </div>

        {allTransactions.length > 0 && (
          <ActivityStats
            transactions={allTransactions}
            activityStats={activityStats}
            mostActiveChain={mostActiveChain}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
