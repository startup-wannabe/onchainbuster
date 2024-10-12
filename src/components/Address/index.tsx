type Props = {
  value: string;
  truncatedLength?: number;
  truncated?: boolean;
};

const Address = ({ value, truncated, truncatedLength = 4 }: Props) => {
  return (
    <span className="font-bold">
      {truncated
        ? `${value.slice(0, truncatedLength)}...${value.slice(value.length - truncatedLength)}`
        : value}
    </span>
  );
};

export default Address;
