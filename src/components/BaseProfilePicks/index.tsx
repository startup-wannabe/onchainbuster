import React from 'react';
import Content from '../Ecosystem/Content';
import { useMagicTraits } from '@/app/hooks/useMagicTraits';
import { UserTrait, getBaseTraits } from '@/helpers/trait.helper';

type Props = {};

const BaseProfilePicks = (props: Props) => {
  const {
    defitOrArtTraitResult,
    degenOrDiamondHandResult,
    originalBuilderOrMultichainCitizen,
  } = useMagicTraits();
  return (
    <div
      className="py-[50px] px-[100px] rounded-3xl shadow-xl"
      style={{
        position: 'relative',
        background: `url('/background.avif')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="flex items-center flex-col justify-center mb-6">
        <h2 className="mb-4 font-bold text-2xl">Your Based Picks</h2>
        <h3 className="mb-4 text-xl">
          Since you are {defitOrArtTraitResult.trait},{' '}
          {degenOrDiamondHandResult.trait}, and{' '}
          {originalBuilderOrMultichainCitizen.trait}, let's discover{' '}
          {getBaseTraits([
            defitOrArtTraitResult.trait,
            degenOrDiamondHandResult.trait,
            originalBuilderOrMultichainCitizen.trait,
          ] as UserTrait[])}{' '}
          products
        </h3>
      </div>
      <Content
        firstTrait={defitOrArtTraitResult.trait as UserTrait}
        secondTrait={degenOrDiamondHandResult.trait as UserTrait}
        thirdTrait={originalBuilderOrMultichainCitizen.trait as UserTrait}
      />
    </div>
  );
};

export default BaseProfilePicks;
