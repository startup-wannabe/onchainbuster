'use client';
import BaseSvg from '@/assets/svg/BaseSvg';
import { ONCHAINKIT_LINK } from '@/constants/links';
import { useWagmiConfig } from '@/wagmi';
import { getEnsAddress } from '@wagmi/core';
import { useState } from 'react';
import Footer from 'src/components/Footer';
import { normalize } from 'viem/ens';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';
import { getDagoraProfile } from './api/dagoraCallers';
import {
  listAllEVMTransactions,
  searchAddressFromOneID,
} from './api/explorerCallers';
import { listAllNFTProfile } from './api/reservoirCallers';

export default function Page() {
  const { address } = useAccount();

  const wagmiConfig = useWagmiConfig();

  const [text, setText] = useState('');
  const [inputAddress, setInputAddress] = useState('');

  const getAddress = async (text: string) => {
    let address = '';
    if (text.startsWith('0x')) {
      address = text;
    } else if (text.endsWith('.eth')) {
      address = (await getEnsAddress(wagmiConfig, {
        name: normalize(text),
        chainId: 1,
      })) as string;
      // console.log('ENS Address:', address);
    } else {
      address = await searchAddressFromOneID(text);
      // console.log('OneID Address:', address);
    }

    setInputAddress(address);
    return address;
  };

  const handleSearchAllExplorers = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllEVMTransactions(address);
    console.log('evmTransactions:', data);
  };

  const handleDagoraProfile = async (text: string) => {
    const address = await getAddress(text);
    const data = await getDagoraProfile(address);
    console.log('dagoraProfile:', data);
  };

  const handleReservoirProfile = async (text: string) => {
    const address = await getAddress(text);

    // const data = await listAllNFTProfile(address);
    // console.log('data:', data);
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
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 px-2 py-4 md:grow">
        <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
          <input
            type="text"
            placeholder="EVM address 0x..., ENS, Basename, OneID"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mr-2 w-full"
          />
        </section>

        {inputAddress !== '' ? (
          <p>Your EVM address: {inputAddress}</p>
        ) : (
          <p>Address not found</p>
        )}

        <button
          type="button"
          onClick={() => handleDagoraProfile(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Dagora Profile
        </button>
        <button
          type="button"
          onClick={() => handleSearchAllExplorers(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Multi-EVM Transactions
        </button>
        <button
          type="button"
          onClick={() => handleReservoirProfile(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Reservoir Transactions
        </button>
      </section>
      <Footer />
    </div>
  );
}
