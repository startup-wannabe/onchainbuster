import { normalize } from 'viem/ens';
import { useEnsAvatar, useEnsName } from 'wagmi';

type Props = {
  address: `0x${string}`;
  ens?: string;
};

const ProfileCard = ({ address, ens }: Props) => {
  const ensNameResult = useEnsName({
    address,
  });
  const ensAvatarResult = useEnsAvatar({
    name: normalize(ens || ''),
  });

  return (
    <div className="h-[200px] w-[350px] rounded-2xl shadow-2xl py-5 px-5 text-white bg-blue-500">
      <span className="font-bold text-xl">{address}</span>
      {ensNameResult.data}
      {ensAvatarResult.data}
    </div>
  );
};

export default ProfileCard;
