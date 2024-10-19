import { AppStage } from "@/app/contexts/MagicContext";
import { useMagic } from "@/app/hooks/useMagic";
import { useMagicContext } from "@/app/hooks/useMagicContext";
import { ThreeStageState } from "@/app/state.type";
import { makeid, selectState, setState } from "@/helpers";
import { ArrowLeftIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Spinner } from "@radix-ui/themes";
import { Alert } from "antd";
import React, { useRef, useState } from "react";
import { useAccount } from "wagmi";
import MintableBaseProfile from "../BaseMinting";
import BaseProfileDetailView from "../BaseProfileDetailView";
import BaseProfilePicks from "../BaseProfilePicks";
import HowBasedAreYouHeader from "../HowBasedAreYouHeader";
import MagicButton from "../MagicButton";

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
  const [tokenId, setTokenId] = useState<string | undefined>(undefined);
  const [detailShown, setDetailShown] = useState(false);
  const { appStage, nftTemplateSetting } = useMagicContext();

  const viewDetails = () => {
    setDetailShown(true);
    bottomAnchor.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex items-center justify-center flex-col">
      <div className="flex justify-center flex-col items-center">
        {(selectState(appStage) === AppStage.DisplayProfile ||
          selectState(appStage) === AppStage.GetBased) &&
          !stateCheck("HowBasedAreYou", ThreeStageState.Idle) && (
            <HowBasedAreYouHeader
              scale={0.6}
              name={addressInput}
              className="text-xl"
            />
          )}
        {stateCheck("MintProfileNft", ThreeStageState.Finished) && tokenId && (
          <Alert
            showIcon={true}
            type="success"
            className="rounded-3xl"
            message={
              <a
                className="font-bold cursor-pointer flex justify-center items-center gap-4"
                href={`https://testnets.opensea.io/assets/base-sepolia/0x0e3193772aef408843a68cd17f9bb70e9dab7cc5/${tokenId}`}
                target="_blank"
                rel="noreferrer"
              >
                Profile is collected and live on Opensea. See it now!{" "}
                <EyeOpenIcon />
              </a>
            }
          />
        )}
        <div className="flex gap-4 justify-center items-center mt-3">
          {selectState(appStage) === AppStage.GetBased &&
            !stateCheck("HowBasedAreYou", ThreeStageState.Idle) && (
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
            !stateCheck("HowBasedAreYou", ThreeStageState.Idle) && (
              <button
                onClick={async () => {
                  if (!address) return;
                  const data = await mintNft(
                    selectState(nftTemplateSetting).ref,
                    `${address}-${makeid(3)}.png`,
                    address,
                    (data) => {
                      console.log(data);
                    }
                  );
                  if (!data) return;
                  console.log(data);
                  setTokenId(data.tokenId);
                }}
                type="button"
                style={{ borderRadius: 30 }}
                className="shadow-xl py-2 px-5 hover:bg-blue-500 hover:text-white"
              >
                {address ? (
                  <React.Fragment>
                    {stateCheck(
                      "MintProfileNft",
                      ThreeStageState.InProgress
                    ) ? (
                      <span className="flex justify-center gap-2 items-center">
                        <Spinner loading={true} /> Collecting your profile...
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
            !stateCheck("HowBasedAreYou", ThreeStageState.Idle) && (
              <button
                onClick={() => setState(appStage)(AppStage.GetBased)}
                type="button"
                style={{ width: 250, borderRadius: 30 }}
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                <span className="flex justify-center gap-2 items-center text-xl ">
                  🚀 Get Based
                </span>
              </button>
            )}
          {selectState(appStage) === AppStage.DisplayProfile &&
            !stateCheck("HowBasedAreYou", ThreeStageState.Idle) && (
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
      {selectState(appStage) === AppStage.GetBased && <BaseProfilePicks />}
      {selectState(appStage) === AppStage.DisplayProfile && (
        <MintableBaseProfile />
      )}
      {selectState(appStage) === AppStage.DisplayProfile && (
        <React.Fragment>
          {detailShown && <BaseProfileDetailView />}
          {bottomAnchor && <div ref={bottomAnchor as any}></div>}
        </React.Fragment>
      )}
    </section>
  );
};

export default ShowcaseBaseProfile;
