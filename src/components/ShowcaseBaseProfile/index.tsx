import { useMagic } from '@/app/hooks/useMagic';
import { ThreeStageState } from '@/app/state.type';
import HowBasedAreYouHeader from '../HowBasedAreYouHeader';
import React, { useRef, useState } from 'react';
import BaseProfileDetailView from '../BaseProfileDetailView';
import MagicButton from '../MagicButton';
import { ArrowLeftIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { makeid, selectState, setState } from '@/helpers';
import { AppStage } from '@/app/contexts/MagicContext';
import BaseProfilePicks from '../BaseProfilePicks';
import MintableBaseProfile from '../BaseMinting';
import { Spinner } from '@radix-ui/themes';
import { useAccount } from 'wagmi';

type Props = {
  addressInput: string;
};

const ShowcaseBaseProfile = ({ addressInput }: Props) => {
  const { address } = useAccount();
  const bottomAnchor = useRef<HTMLDivElement | undefined>();
  const {
    query: { stateCheck },
    mutate: { mintNft },
  } = useMagic();
  const [detailShown, setDetailShown] = useState(false);
  const { appStage, nftTemplateSetting } = useMagicContext();

  const viewDetails = () => {
    setDetailShown(true);
    bottomAnchor.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="flex items-center justify-center flex-col">
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
        <div className="flex gap-4 justify-center items-center">
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
          {selectState(appStage) === AppStage.DisplayProfile &&
            !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
              <button
                onClick={async () => {
                  if (!address) return;
                  await mintNft(
                    selectState(nftTemplateSetting).ref,
                    `${address}-${makeid(3)}.png`,
                    address,
                    (data) => {
                      console.log(data);
                    },
                  );
                }}
                type="button"
                style={{ borderRadius: 30 }}
                className="shadow-xl py-2 px-5 hover:bg-blue-500 hover:text-white"
              >
                {address ? (
                  <React.Fragment>
                    {stateCheck(
                      'MintProfileNft',
                      ThreeStageState.InProgress,
                    ) ? (
                      <span className="flex justify-center gap-2 items-center">
                        <Spinner loading /> Collecting your profile...
                      </span>
                    ) : (
                      <span className="flex justify-center gap-2 items-center">
                        Collect your profile 🤗
                      </span>
                    )}
                  </React.Fragment>
                ) : (
                  <span className="flex justify-center gap-2 items-center">
                    No wallet connected 😢
                  </span>
                )}
              </button>
            )}
          {selectState(appStage) === AppStage.DisplayProfile &&
            !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
              <button
                onClick={() => setState(appStage)(AppStage.GetBased)}
                type="button"
                style={{ width: 250, borderRadius: 30 }}
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
              >
                <span className="flex justify-center gap-2 items-center text-xl">
                  🚀 Get Based
                </span>
              </button>
            )}
          {selectState(appStage) === AppStage.DisplayProfile &&
            !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
              <button
                onClick={() => viewDetails()}
                type="button"
                style={{ borderRadius: 30 }}
                className="shadow-xl py-2 px-5 hover:bg-blue-500 hover:text-white"
              >
                <span className="flex justify-center gap-2 items-center">
                  <EyeOpenIcon /> View Details
                </span>
              </button>
            )}
        </div>
      </div>
      {selectState(appStage) === AppStage.DisplayProfile &&
        !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
          <MintableBaseProfile />
        )}
      {selectState(appStage) === AppStage.GetBased &&
        !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
          <BaseProfilePicks />
        )}
      {selectState(appStage) === AppStage.DisplayProfile &&
        !stateCheck('HowBasedAreYou', ThreeStageState.Idle) && (
          <React.Fragment>
            {detailShown && <BaseProfileDetailView />}
            {bottomAnchor && <div ref={bottomAnchor as any}></div>}
          </React.Fragment>
        )}
    </section>
  );
};

export default ShowcaseBaseProfile;
