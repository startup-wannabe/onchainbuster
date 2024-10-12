import React from 'react';
import BaseSvg from '@/assets/svg/BaseSvg';

type Props = {
  icon: {
    width: number;
    height: number;
  };
  className?: string;
  name?: string;
};

const HowBasedAreYouHeader = (props: Props) => {
  return (
    <h1 className={`inline-flex text-4xl mb-6 ${props.className}`}>
      How
      <span className="flex mx-2 font-bold">
        <BaseSvg width={props.icon.width} height={props.icon.height} />{' '}
        <span style={{ marginLeft: 5 }}>Based</span>
      </span>{' '}
      {props.name ? `is ${props.name}` : 'are you'}?
    </h1>
  );
};

export default HowBasedAreYouHeader;
