'use client';
import { MIDDLE_STYLE, useBreakpoint } from '@/app/hooks/useBreakpoint';
import { useMagic } from '@/app/hooks/useMagic';
import { ThreeStageState } from '@/app/state.type';
import * as animationData from '@/assets/animation/pink-loading.json';
import { Modal } from 'antd';
import Lottie from 'react-lottie';

type Props = { container: any | undefined };

const MintingStatusOverlay = ({ container }: Props) => {
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
      open={stateCheck('MintProfileNft', ThreeStageState.InProgress)}
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
              !stateCheck('MintProfileNft', ThreeStageState.InProgress)
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
          {stateCheck('MintProfileNft', ThreeStageState.InProgress) &&
            'Sending profile'}
        </h2>
        <p
          style={{
            fontSize: isTablet ? 15 : 20,
            textAlign: 'center',
            margin: 0,
            color: 'white',
          }}
        >
          {stateCheck('MintProfileNft', ThreeStageState.InProgress) &&
            'Uploading image and sending a collectible to you...'}
        </p>
      </div>
    </Modal>
  );
};

export default MintingStatusOverlay;
