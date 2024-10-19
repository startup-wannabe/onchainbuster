'use client';

import type React from 'react';
import { type CSSProperties, useEffect, useId, useRef } from 'react';
import DecorativeCard from '../DecorativeCard';
import { useCards } from './context';

type HoverShimmerProps = {
  children: React.ReactNode;
  wrapperClassName?: string;
  innerClassName?: string;
  radius?: number;
};

export default function Card({
  children,
  wrapperClassName,
  innerClassName,
  radius = 16,
}: HoverShimmerProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  const fakeBlobRef = useRef<HTMLDivElement>(null);

  const { registerCard, unregisterCard } = useCards();
  const id = useId();

  useEffect(() => {
    registerCard(id, { blobRef, fakeBlobRef });
    return () => unregisterCard(id);
  }, [registerCard, unregisterCard, id]);

  /* 
    Shimmer / Tailwind integration notes:
    - Converted from https://codepen.io/yxshv/pen/JjaRZmb
    - The card "border" is controlled via the padding, p-[1px]
  */
  const cardClasses = `card overflow-hidden p-[1px] m-0 bg-white/20 relative ${wrapperClassName} w-full`;

  const blobClasses =
    'blob blur-[40px] z-10 absolute opacity-0 w-[30rem] h-[30rem] rounded-full bg-[rgb(255,255,255,0.2)]';

  const fakeBlobClasses =
    'fake-blob absolute w-[30rem] h-[30rem] rounded-full opacity-0';

  const innerClasses = `inner relative bg-grey z-20 h-full ${innerClassName}`;
  const innerStyles: CSSProperties = {
    borderRadius: `${radius - 1}px`,
  };

  return (
    <DecorativeCard className={cardClasses}>
      <div className={innerClasses} style={innerStyles}>
        {children}
      </div>
      <div className={blobClasses} ref={blobRef} />
      <div className={fakeBlobClasses} ref={fakeBlobRef} />
    </DecorativeCard>
  );
}
