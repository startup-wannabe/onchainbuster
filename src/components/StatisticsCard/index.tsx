import { Separator } from '@radix-ui/themes';
import React from 'react';

type Props = {
  title: string;
  content: React.ReactElement | string;
  className?: string;
};

const StatisticsCard = ({ title, content, className }: Props) => {
  return (
    <div
      className={`mx-1 w-fit rounded-2xl border border-palette-line/20 px-4 py-3 shadow-xl ${className}`}
    >
      <h1 className="font-bold text-md">{title}</h1>
      <Separator className="mt-2 mb-3" size={'4'} />
      {content}
    </div>
  );
};

export default StatisticsCard;
