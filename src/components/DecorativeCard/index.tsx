import type React from 'react';

type Props = {
  children?: React.ReactElement | React.ReactNode;
  className?: string;
};

const DecorativeCard = ({ children, className }: Props) => {
  return (
    <div
      className={`w-full bg-white rounded-3xl shadow-md hover:shadow-xl cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default DecorativeCard;
