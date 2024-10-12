import React from "react";
import HowBasedAreYouHeader from "../HowBasedAreYouHeader";
import { useMagic } from "@/app/hooks/useMagic";
import { ThreeStageState } from "@/app/state.type";
import LoadableContainer from "../LoadableContainer";
import { Spinner } from "@radix-ui/themes";
import TokenPortfolio from "../TokenPortfolio";
import { useMagicContext } from "@/app/hooks/useMagicContext";
import ActivityStats from "../ActivityStats";

type Props = {
  addressInput: string;
};

const ShowcaseBaseProfile = ({ addressInput }: Props) => {
  const {
    query: { stateCheck },
  } = useMagic();
  const {
    allTransactions: [allTransactions],
    activityStats: [activityStats],
    mostActiveChain: [mostActiveChain],
    tokenPortfolio: [tokenPortfolio],
    marketData: [marketData],
  } = useMagicContext();
  return (
    <section className="flex items-center justify-center flex-col">
      <HowBasedAreYouHeader
        name={addressInput}
        className="text-xl"
        icon={{
          width: 30,
          height: 30,
        }}
      />
      {stateCheck("ActivityStats", ThreeStageState.Finished) && (
        <div className="mt-8">
          <div className="flex items-center justify-center">
            <h2 className="mb-4 font-bold text-2xl">Activity Statistics</h2>
          </div>
          <LoadableContainer
            isLoading={stateCheck("ActivityStats", ThreeStageState.InProgress)}
            loadComponent={<Spinner />}
          >
            {allTransactions.length > 0 && (
              <ActivityStats
                transactions={allTransactions}
                activityStats={activityStats}
                mostActiveChain={mostActiveChain}
              />
            )}
          </LoadableContainer>
        </div>
      )}
      {stateCheck("GetTokenPortfolio", ThreeStageState.Finished) && (
        <div className="mt-8">
          <div className="flex items-center justify-center">
            <h2 className="mb-4 font-bold text-2xl">Multi-chain Assets</h2>
          </div>
          {tokenPortfolio.length > 0 && (
            <TokenPortfolio
              tokenPortfolio={tokenPortfolio}
              marketData={marketData}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default ShowcaseBaseProfile;
