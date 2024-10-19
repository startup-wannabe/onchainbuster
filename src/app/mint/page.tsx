"use client";
import {} from "@/lib/pinata";
import Image from "next/image";
import { useEffect } from "react";
import { listEVMScanNFTActivity } from "../api/evmScanCallers";

type Props = {
  toAddress: string;
  blockHash: string;
};
export default function Instamint({ toAddress, blockHash }: Props) {
  const getTransactionDetail = async () => {
    const data = await listEVMScanNFTActivity(
      "0xC94Fe41573d28e9D9dc4d46593B78c764a4BfE29", // TODO: Replace with toAddress
      "BASE-SEPOLIA",
      3 // Get 3 latest transaction
    );

    const matchingTransaction = data.find(
      (transaction) =>
        transaction.blockHash.toLowerCase() ===
        "0x80c9831dffc600e7466b8adc62f14513708431564bc6724b628e5a7dc468749f".toLowerCase()
    );

    console.log("matchingTransaction", matchingTransaction);
    console.log("tokenID", matchingTransaction?.tokenId);
  };

  useEffect(() => {
    getTransactionDetail();
  }, []);

  // const dataURLtoBlob = (dataURL: string) => {
  //   const byteString = atob(dataURL.split(',')[1]);
  //   const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ab], { type: mimeString });
  // };

  // const onMint = async () => {
  //   setIsMinting(true);
  //   try {
  //     // Upload image to pinata
  //     const keyData = await generatePinataKey();
  //     let dataUrl = '';
  //     if (elRef.current) {
  //       // Capture the component as a PNG image
  //       dataUrl = await toPng(elRef.current);
  //     } else {
  //       throw 'Ref is not available';
  //     }

  //     // TODO: Enable dynamic image on prod

  //     // Convert the data URL to a Blob so it can be uploaded
  //     // const blob = dataURLtoBlob(dataUrl);
  //     // const fileCID = await uploadFile(blob, keyData.JWT);
  //     const fileCID =
  //       'bafkreiae3upg3asjkfu5ogi7cah7lyjjxg27jmdzmalfkzfqlvfhqa6rue';

  //     const metadata = {
  //       name: `Onchain Buster Trait - ${toAddress}`,
  //       description: 'Generated image from Onchain Buster',
  //       image: fileCID,
  //       external_url: 'https://onchainbuster.vercel.app',
  //     };

  //     const uriCID = await uploadJson(metadata, keyData.JWT);

  //     console.log('Initiating minting process');
  //     const response = await fetch('/api/cdp/mint', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         networkId: BASE_SEPOLIA_CHAIN_ID,
  //         to: toAddress,
  //         uri: uriCID,
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data: MintResponse = await response.json();
  //     console.log('Mint response:', data);
  //     // Store the response data
  //     setMintData(data);
  //     setIsMintSuccessful(true);
  //   } catch (error) {
  //     console.error('Error during minting:', error);
  //     alert('Failed to mint. Please try again.');
  //   } finally {
  //     setIsMinting(false);
  //   }
  // };
  // const onViewMintTransaction = () => {
  //   // Implement view transaction logic
  //   console.log('View transaction');
  //   if (mintData?.mintTxUrl) {
  //     window.open(mintData.mintTxUrl, '_blank');
  //   } else {
  //     console.error('Mint transaction URL is not available');
  //   }
  // };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-4 w-full">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Test Mint Dialog
          <div>
            <Image
              src={"/logo.png"}
              alt="Modal image"
              width={300}
              height={300}
              objectFit="contain"
              className="rounded-lg shadow-md"
            />
          </div>
        </h1>

        {/* <button
          type="button"
          onClick={onMint}
          className={"bg-blue-500 hover:bg-blue-600"}
        >
          Mint it!
        </button>

        <button type="button" onClick={onViewMintTransaction}>
          View mint transaction
        </button> */}
      </div>
    </>
  );
}
