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
          onClick={() => handleSearchAllNativeTokenBalance(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Multi-EVM Native Balance
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
          onClick={() => handleSearchAllTokenActivity(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Multi-EVM Token Activity
        </button>

        <button
          type="button"
          onClick={() => handleSearchAllTokenBalance(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Multi-EVM Token Balance
        </button>

        <button
          type="button"
          onClick={() => handleSearchAllNFTBalance(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Multi-EVM NFT Balance
        </button>
        <button
          type="button"
          onClick={() => handleSearchAllNFTActivity(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Multi-EVM NFT Activity
        </button>
      </section>

      <Footer />
    </div>
  );
}
