import { chainIDMap } from '@/constants/chains';

type Props = { chainId: string; width?: number; height?: number };

const ChainIcon = ({ chainId, width, height }: Props) => {
  return (
    <img
      src={chainIDMap[chainId]?.logoURI}
      key={chainId}
      className="inline-block h-6 w-6 rounded-full shadow-md"
      style={{
        width: width || 25,
        height: height || 25,
      }}
      alt={`${chainIDMap[chainId]?.name} logo`}
    />
  );
};

export default ChainIcon;
