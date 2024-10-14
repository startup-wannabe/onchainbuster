import { chainIDMap } from '@/constants/chains';
import { Avatar } from '@radix-ui/themes';

type Props = { chainId: string };

const ChainIcon = ({ chainId }: Props) => {
  return (
    <Avatar
      src={chainIDMap[chainId].logoURI}
      key={chainId}
      className="mr-1 inline-block h-6 w-6 rounded-full"
      width={25}
      height={25}
      alt={`${chainIDMap[chainId].name} logo`}
      fallback={chainIDMap[chainId].name.slice(0, 2)}
    />
  );
};

export default ChainIcon;
