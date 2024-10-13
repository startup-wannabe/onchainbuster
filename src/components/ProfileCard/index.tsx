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
    <div className="h-[fit] w-[fit] rounded-3xl shadow-2xl py-5 px-5 text-white bg-blue-500">
      <Identity
        address={address}
        className="px-4 pt-3 pb-2 bg-blue-500 hover:bg-blue-300"
        hasCopyAddressOnClick={true}
      >
        <Avatar className="h-10 w-10 text-white" />
        <Name className="text-white" />
        <Address className="text-white" />
        <EthBalance className="text-white" />
      </Identity>
    </div>
  );
};

export default ProfileCard;
