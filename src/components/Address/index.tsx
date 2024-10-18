type Props = {
  value: string;
  truncatedLength?: number;
  truncated?: boolean;
  className?: string;
};

const Address = ({
  value,
  truncated,
  truncatedLength = 4,
  className,
}: Props) => {
  const first = value.slice(0, truncatedLength);
  const second = value.slice(value.length - truncatedLength);
  return (
    <span className={`font-bold ${className}`}>
      {truncated ? `${first}...${second}` : value}
    </span>
  );
};

export default Address;
