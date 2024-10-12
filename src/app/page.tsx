'use client';
import BaseSvg from '@/assets/svg/BaseSvg';
import ActivityStats from '@/components/ActivityStats';
import LoadableContainer from '@/components/LoadableContainer';
import MagicButton from '@/components/MagicButton';
import TokenPortfolio from '@components/TokenPortfolio';
import { ONCHAINKIT_LINK } from '@/constants/links';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Separator, Spinner, TextField } from '@radix-ui/themes';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';

import HowBasedAreYouHeader from '../components/HowBasedAreYouHeader';
import {
  listAllNFTActivityByChain,
  listAllTokenActivityByChain,
} from './api/services';
import { ThreeStageState } from './state.type';
import { useMagic } from './hooks/useMagic';

// TODO: Remove this when ready.
const MOCK_WALLET_ADDRESS = '0x294d404b2d2A46DAb65d0256c5ADC34C901A6842';

export default function Page() {
  const { address } = useAccount();
  // TODO: Remove the mock value when ready.
  const [addressInput, setAddressInput] = useState(MOCK_WALLET_ADDRESS);
  const {
    state: {
      activityStats,
      inputAddress,
      marketData,
      mostActiveChain,
      // nftPortfolio,
      tokenPortfolio,
      allTransactions,
    },
    query: { getAddress, stateCheck },
    mutate: { letsDoSomeMagic },
  } = useMagic();

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
        <HowBasedAreYouHeader
          icon={{
            width: 40,
            height: 40,
          }}
        />
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
              onClick={() => letsDoSomeMagic(addressInput)}
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
      <Separator size={'4'} className="mb-10" />
      <div className="flex items-center justify-center flex-col">
        <HowBasedAreYouHeader
          name="Vitalik Buterin"
          className="text-xl"
          icon={{
            width: 30,
            height: 30,
          }}
        />
        {stateCheck('ActivityStats', ThreeStageState.Finished) && (
          <div className="mt-8">
            <div className="flex items-center justify-center">
              <h2 className="mb-4 font-bold text-2xl">Activity Statistics</h2>
            </div>
            <LoadableContainer
              isLoading={stateCheck(
                'ActivityStats',
                ThreeStageState.InProgress,
              )}
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
    </div>
  );
}
