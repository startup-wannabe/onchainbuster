import { useMagic } from '@/app/hooks/useMagic';
import { ThreeStageState } from '@/app/state.type';
import HowBasedAreYouHeader from '../HowBasedAreYouHeader';
import React, { useRef } from 'react';
import BaseProfileDetailView from '../BaseProfileDetailView';
import MagicButton from '../MagicButton';
import MagicBaseGridCard from '../MagicBaseGridCard';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { selectState, setState } from '@/helpers';
import { AppStage } from '@/app/contexts/MagicContext';
import BaseProfilePicks from '../BaseProfilePicks';
import BaseMinting from '../BaseMinting';

type Props = {
  addressInput: string;
};

const ShowcaseBaseProfile = ({ addressInput }: Props) => {
  const bottomAnchor = useRef<HTMLDivElement | undefined>();
  const {
    query: { stateCheck },
  } = useMagic();
  const { appStage } = useMagicContext();

  const viewDetails = () => {
    bottomAnchor.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="flex items-center justify-center flex-col">
      {stateCheck('ActivityStats', ThreeStageState.Finished) && (
        <div className="mb-5 flex justify-center flex-col items-center">
          {(selectState(appStage) === AppStage.DisplayProfile ||
            selectState(appStage) === AppStage.GetBased) &&
            !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
              <HowBasedAreYouHeader
                scale={0.6}
                name={addressInput}
                className="text-xl"
              />
            )}
          <div className="flex gap-4">
            {selectState(appStage) === AppStage.DisplayProfile &&
              !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
                <MagicButton
                  text={
                    <span className="flex justify-center gap-2 items-center">
                      🚀 Get Based
                    </span>
                  }
                  onClick={() => setState(appStage)(AppStage.GetBased)}
                />
              )}
            {selectState(appStage) === AppStage.GetBased &&
              !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
                <MagicButton
                  text={
                    <span className="flex justify-center gap-2 items-center">
                      <ArrowLeftIcon /> View Profile Stats
                    </span>
                  }
                  onClick={() => setState(appStage)(AppStage.DisplayProfile)}
                />
              )}
            {selectState(appStage) === AppStage.GetBased &&
              !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
                <MagicButton
                  text={
                    <span className="flex justify-center gap-2 items-center">
                      Mint your profile NFT <ArrowRightIcon />
                    </span>
                  }
                  onClick={() => setState(appStage)(AppStage.MintNft)}
                />
              )}
            {selectState(appStage) === AppStage.DisplayProfile &&
              !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
                <MagicButton
                  text={
                    <span className="flex justify-center gap-2 items-center">
                      <EyeOpenIcon /> View Details
                    </span>
                  }
                  onClick={() => viewDetails()}
                />
              )}
          </div>
        </div>
      )}
      {selectState(appStage) === AppStage.DisplayProfile &&
        !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
          <MagicBaseGridCard />
        )}
      {selectState(appStage) === AppStage.GetBased &&
        !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
          <BaseProfilePicks />
        )}
      {selectState(appStage) === AppStage.MintNft &&
        !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && <BaseMinting />}
      {selectState(appStage) === AppStage.DisplayProfile &&
        !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
          <React.Fragment>
            {bottomAnchor && <div ref={bottomAnchor as any}></div>}
            <BaseProfileDetailView />
          </React.Fragment>
        )}
    </section>
  );
};

export default ShowcaseBaseProfile;
