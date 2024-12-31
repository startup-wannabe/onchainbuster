import { useOnchainKit } from "@coinbase/onchainkit";
import {
  Address,
  Identity,
  Name,
  useAvatar,
  useName,
} from "@coinbase/onchainkit/identity";
import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
import { isAddress } from "viem";

type Props = {
  address: `0x${string}`;
  oneID: string; // Special name service
};

const ProfileCard = ({ address, oneID }: Props) => {
  const { chain: contextChain } = useOnchainKit();
  const { data: name } = useName({
    address: address,
    chain: contextChain,
  });

  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar(
    { ensName: name ?? "", chain: contextChain },
    { enabled: !!name }
  );
  const randomAvatar = useMemo(() => {
    return createAvatar(thumbs, {
      size: 128,
      seed: address,
      rotate: 60,
      backgroundColor: [
        "0a5b83",
        "1c799f",
        "69d2e7",
        "b6e3f4",
        "c0aede",
        "d1d4f9",
        "f1f4dc",
        "ffd5dc",
        "ffdfbf",
      ],
      backgroundType: ["solid", "gradientLinear"],
      eyesColor: ["ffffff"],
      mouthColor: ["ffffff"],
      shapeColor: ["0a5b83", "1c799f", "69d2e7"],
    }).toDataUri();
  }, [address]);
  return (
    <div className="h-full w-[fit] items-center flex justify-center flex-col text-black">
      <div className="mb-3">
        {avatar && isLoadingAvatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="shadow-md"
            style={{ width: 200, height: 200, borderRadius: "20px" }}
          />
        ) : (
          <img
            src={randomAvatar}
            alt="avatar"
            className="shadow-md"
            style={{ width: 200, height: 200, borderRadius: "20px" }}
          />
        )}
      </div>
      {isAddress(address) && (
        <>
          {name ? (
            // Prioritize Base/ENS if any
            <Identity
              address={address}
              className="px-4 pt-3 pb-2 flex justify-center items-center hover:bg-blue-300 bg-white"
            >
              <Name className="text-black text-3xl" />
            </Identity>
          ) : (
            oneID && (
              // If not then check OneID
              <span className="text-black text-3xl font-bold text-ock-foreground font-sans leading-normal">
                {oneID}
              </span>
            )
          )}
        </>
      )}
      {isAddress(address) && (
        <Identity
          address={address}
          className="flex justify-center items-center hover:bg-blue-300 bg-white"
          hasCopyAddressOnClick={true}
        >
          <Address className="text-black text-xl" />
        </Identity>
      )}
    </div>
  );
};

export default ProfileCard;
