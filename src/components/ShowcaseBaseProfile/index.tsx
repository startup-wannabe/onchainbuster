import { useMagic } from '@/app/hooks/useMagic';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { ThreeStageState } from '@/app/state.type';
import { Separator, Spinner } from '@radix-ui/themes';
import ActivityStats from '../ActivityStats';
import HowBasedAreYouHeader from '../HowBasedAreYouHeader';
import LoadableContainer from '../LoadableContainer';
import ProfileCard from '../ProfileCard';
import TokenPortfolio from '../TokenPortfolio';

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
      {stateCheck('ActivityStats', ThreeStageState.Finished) && (
        <HowBasedAreYouHeader name={addressInput} className="text-xl" />
      )}
      <ProfileCard address={addressInput as any} />
      {stateCheck('ActivityStats', ThreeStageState.Finished) && (
        <>
          <div className="mt-8">
            <div className="flex items-center justify-center">
              <h2 className="mb-4 font-bold text-2xl">Activity Statistics</h2>
            </div>
            <LoadableContainer
              isLoading={stateCheck(
                'ActivityStats',
                ThreeStageState.InProgress,
              )}
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
        </>
      )}
      {stateCheck('ActivityStats', ThreeStageState.Finished) &&
        stateCheck('GetTokenPortfolio', ThreeStageState.Finished) && (
          <>
            <Separator className="mt-[80px]" size={'4'} />
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
          </>
        )}
    </section>
  );
};

export default ShowcaseBaseProfile;
