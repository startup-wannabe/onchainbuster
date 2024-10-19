import { useMagicTraits } from '@/app/hooks/useMagicTraits';
import { type UserTrait, getBaseTraits } from '@/helpers/trait.helper';
import { toCapitalize } from '@/utils/strings';
import Content from '../Ecosystem/Content';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { selectState } from '@/helpers';
import { BackgroundVariant } from '@/app/contexts/MagicContext';

type Props = {};

const BaseProfilePicks = (props: Props) => {
  const {
    defitOrArtTraitResult,
    degenOrDiamondHandResult,
    originalBuilderOrMultichainCitizen,
  } = useMagicTraits();
  const { nftTemplateSetting } = useMagicContext();
  return (
    <div
      className="py-[50px] px-[100px] rounded-3xl shadow-xl"
      style={{
        position: 'relative',
        background:
          selectState(nftTemplateSetting).backgroundType ===
          BackgroundVariant.Color
            ? `${selectState(nftTemplateSetting).backgroundValue}`
            : `url('${selectState(nftTemplateSetting).backgroundValue}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="flex bg-white shadow-xl py-5 rounded-xl items-center flex-col justify-center mb-6">
        <h2 className="mb-4 font-bold text-2xl">Your Based Picks</h2>
        <h3 className="mb-4 text-xl">
          Since you are {defitOrArtTraitResult.trait},{' '}
          {degenOrDiamondHandResult.trait}, and{' '}
          {originalBuilderOrMultichainCitizen.trait}, let's discover{' '}
          {toCapitalize(
            getBaseTraits([
              defitOrArtTraitResult.trait,
              degenOrDiamondHandResult.trait,
              originalBuilderOrMultichainCitizen.trait,
            ] as UserTrait[]),
          )}{' '}
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
