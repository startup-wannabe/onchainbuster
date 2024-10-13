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
    <div className="h-[fit] w-[fit] rounded-3xl shadow-2xl py-3 px-4 text-white bg-blue-500">
      <Identity
        address={address}
        className="px-4 pt-3 pb-2 bg-blue-500 hover:bg-blue-300"
        hasCopyAddressOnClick={true}
      >
        <Avatar className="h-[50px] w-[50px] text-white" />
        <Name className="text-white text-xl" />
        <Address className="text-white" />
        <EthBalance className="text-white text-md font-bold" />
      </Identity>
    </div>
  );
};

export default ProfileCard;
