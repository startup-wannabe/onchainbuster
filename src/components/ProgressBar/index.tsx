import { useMagic } from '@/app/hooks/useMagic';
import LoadableContainer from '../LoadableContainer';
import { ThreeStageState } from '@/app/state.type';
import { Spinner } from '@radix-ui/themes';

type Props = {
  percentage: number;
};

const ProgressBar = ({ percentage }: Props) => {
  const {
    query: { stateCheck },
  } = useMagic();
  return (
    <div className={'relative rounded-full shadow-xl'}>
      <div
        className={`relative flex ${percentage < 0.5 ? 'bg-[#266EFF]' : 'bg-[#92B6FF]'} shadow-xl border border-palette-line/20`}
        style={{ borderWidth: 5, borderColor: 'white' }}
      >
        <div
          className={`${percentage >= 0.5 ? 'bg-[#266EFF]' : 'bg-[#92B6FF]'} h-[20px]`}
          style={{ width: `calc(${percentage} * 100%)` }}
        />
        {/* Left header */}
        <div
          className={
            'h-[45px] w-[45px] bg-white rounded-full shadow-xl absolute  text-xs top-[-10px] left-[-20px] flex justify-center items-center font-bold border border-palette-line/20'
          }
          style={{ borderWidth: 2 }}
        >
          <LoadableContainer
            isLoading={!stateCheck('HowBasedAreYou', ThreeStageState.Finished)}
            loadComponent={<Spinner loading={true} />}
          >
            {(percentage * 100).toFixed(0)}%
          </LoadableContainer>
        </div>
        {/* Right header */}
        <div
          className={
            'h-[45px] w-[45px] bg-white rounded-full shadow-xl absolute  text-xs top-[-10px] right-[-20px] flex justify-center items-center font-bold border border-palette-line/20'
          }
          style={{ borderWidth: 2 }}
        >
          <LoadableContainer
            isLoading={!stateCheck('HowBasedAreYou', ThreeStageState.Finished)}
            loadComponent={<Spinner loading={true} />}
          >
            {((1 - percentage) * 100).toFixed(0)}%
          </LoadableContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
