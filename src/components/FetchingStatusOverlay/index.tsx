'use client';
import { MIDDLE_STYLE, useBreakpoint } from '@/app/hooks/useBreakpoint';
import { useMagic } from '@/app/hooks/useMagic';
import { ThreeStageState } from '@/app/state.type';
import * as animationData from '@/assets/animation/loading.json';
import { Modal } from 'antd';
import Lottie from 'react-lottie';

type Props = { container: any | undefined };

const FetchingStatusOverlay = ({ container }: Props) => {
  const {
    query: { stateCheck },
  } = useMagic();
  const { isTablet } = useBreakpoint();
  return (
    <Modal
      width={'100%'}
      className="snap-action-modal"
      footer={[]}
      styles={{
        mask: {
          backdropFilter: 'blur(10px)',
        },
      }}
      getContainer={container}
      closeIcon={<></>}
      open={stateCheck('HowBasedAreYou', ThreeStageState.InProgress)}
    >
      <div style={{ ...MIDDLE_STYLE, flexDirection: 'column' }}>
        <div style={{ fontSize: 150 }}>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            speed={2}
            height={400}
            width={400}
            isStopped={
              !stateCheck('HowBasedAreYou', ThreeStageState.InProgress)
            }
          />
        </div>
        <h2
          className="font-bold"
          style={{
            fontSize: isTablet ? 25 : 50,
            margin: 0,
            color: 'white',
          }}
        >
          {stateCheck('GetAddress', ThreeStageState.InProgress) &&
            'Checking your onchain address'}
          {stateCheck('ActivityStats', ThreeStageState.InProgress) &&
            'Fetching activity stats'}
          {stateCheck('GetTokenActivity', ThreeStageState.InProgress) &&
            'Get your token activities'}
          {stateCheck('GetTokenPortfolio', ThreeStageState.InProgress) &&
            'Get your token portfolio'}
          {stateCheck('GetNftActivity', ThreeStageState.InProgress) &&
            'Get your NFT activities'}
          {stateCheck('GetNftPortfolio', ThreeStageState.InProgress) &&
            'Get your NFT portfolio'}
          {stateCheck('GetTalentScore', ThreeStageState.InProgress) &&
            'Get your Builder and Identity scores'}
        </h2>
        <p
          style={{
            fontSize: isTablet ? 15 : 20,
            textAlign: 'center',
            margin: 0,
            color: 'white',
          }}
        >
          {stateCheck('GetAddress', ThreeStageState.InProgress) &&
            'Finding your wallet address on mutli chains...'}
          {stateCheck('ActivityStats', ThreeStageState.InProgress) &&
            'Collecting and analyzing your onchain activity...'}
          {stateCheck('GetTokenActivity', ThreeStageState.InProgress) &&
            'Searching for your token-related transactions...'}
          {stateCheck('GetTokenPortfolio', ThreeStageState.InProgress) &&
            'Analysing your multi-chain token portfolio...'}
          {stateCheck('GetNftActivity', ThreeStageState.InProgress) &&
            'Searching for your NFT-related transactions...'}
          {stateCheck('GetNftPortfolio', ThreeStageState.InProgress) &&
            'Analysing your multi-chain NFT portfolio...'}
          {stateCheck('GetTalentScore', ThreeStageState.InProgress) &&
            'powered by Talent Protocol'}
        </p>
      </div>
    </Modal>
  );
};

export default FetchingStatusOverlay;
