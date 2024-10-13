import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';

type Props = {
  address: `0x${string}`;
};

const ProfileCard = ({ address }: Props) => {
  return (
    <div className="h-full w-[fit] rounded-3xl py-3 px-4 text-black">
      <Identity
        address={address}
        className="px-4 pt-3 pb-2 hover:bg-blue-300 bg-white"
        hasCopyAddressOnClick={true}
      >
        <Avatar className="h-[200px] w-[200px] mr-5" />
        <Name className="text-black text-4xl" />
        <Address className="text-black text-2xl" />
        <EthBalance className="text-black text-2xl font-bold" />
      </Identity>
    </div>
  );
};

export default ProfileCard;
