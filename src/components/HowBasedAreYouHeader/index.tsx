import React from 'react';
import BaseSvg from '@/assets/svg/BaseSvg';
import Address from '../Address';

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
      {props.name ? (
        <span>
          is{' '}
          <span className="font-bold">
            {props.name.startsWith('0x') ? (
              <Address truncatedLength={6} truncated value={props.name} />
            ) : (
              props.name
            )}
          </span>
        </span>
      ) : (
        'are you'
      )}
      ?
    </h1>
  );
};

export default HowBasedAreYouHeader;
