import { MIDDLE_STYLE } from '@/app/hooks/useBreakpoint';
import { GRADIENT_PALLETES } from '@/constants';
import React from 'react';
import MagicButton from '../MagicButton';
import {
  generateJSXMeshGradient,
  generateRandomRgbaStr,
} from '@/helpers/gradient.helper';

const Gradient = (props: any) => {
  const { angle = 0, from, to } = props;

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`,
        width: '50px',
        height: '30px',
        borderRadius: 5,
        backgroundSize: '100%',
      }}
    ></div>
  );
};

const Palette = (props: { from: string; to: string; angle: number }) => {
  return <Gradient {...props} />;
};

type Props = {
  onValueChange: (value: TCanvasGradientBackground) => void;
};

const BackgroundGradientSetting = ({ onValueChange }: Props) => {
  const angle = 135;
  return (
    <React.Fragment>
      <div
        className="mt-5"
        style={{
          ...MIDDLE_STYLE,
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          paddingBottom: 10,
        }}
      >
        {GRADIENT_PALLETES.map((pallete, _) => (
          <div
            onClick={() =>
              onValueChange(
                `linear-gradient(${angle}deg, ${pallete.from}, ${pallete.to})`,
              )
            }
            style={{ margin: '5px 5px', cursor: 'pointer' }}
          >
            <Palette angle={angle} from={pallete.from} to={pallete.to} />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default BackgroundGradientSetting;
