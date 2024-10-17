import { mintABI, mintContractAddress } from '@/constants';
import {} from '@/lib/pinata';
import '@/lib/coinbase';
import { importWallet } from '@/lib/coinbase';
import { NextResponse } from 'next/server';
export type MintResponse = {
  contractAddress: string;
  mintTxHash: string;
  mintTxUrl: string;
};
// Endpoint to mint an NFT.
export async function POST(request: Request) {
  console.log('Starting mint process');
  const body = await request.json();
  const { networkId, to, uri } = body;
  if (networkId === undefined) {
    return NextResponse.json(
      { error: 'Network ID is required' },
      { status: 400 },
    );
  }

  const contractAddress = mintContractAddress;

  let mintResponse: MintResponse;
  try {
    const wallet = await importWallet(0.01);
    const balance = await wallet.getBalance('eth');
    if (balance.lessThan(0.01)) {
      await wallet.faucet();
    }

    // const defaultAddress = await wallet.getDefaultAddress();
    const mintTx = await wallet.invokeContract({
      contractAddress: contractAddress,
      abi: mintABI,
      method: 'safeMint',
      args: {
        to,
        uri: `ipfs://${uri}`,
      },
    });
    await mintTx.wait();
    mintResponse = {
      contractAddress: process.env.NFT_CONTRACT_ADDRESS || '',
      mintTxHash: mintTx.getTransaction().getTransactionHash() || '',
      mintTxUrl: mintTx.getTransaction().getTransactionLink() || '',
    };
    console.log('Minting completed successfully');
    return NextResponse.json(mintResponse);
  } catch (error) {
    console.error('Error during minting process:', error);
    return NextResponse.json({ error: 'Failed to mint NFT' }, { status: 500 });
  }
}
