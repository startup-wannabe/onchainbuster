import React, { useState } from 'react';
import MagicBaseGridCard from '../MagicBaseGridCard';
import BackgroundImageSetting from '../BackgroundImageSetting';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { selectState, setState } from '@/helpers';
import { Select } from 'antd';
import { BackgroundVariant } from '@/app/contexts/MagicContext';
import BackgroundGradientSetting from '../BackgroundGradientColorSetting';
import { MIDDLE_STYLE } from '@/app/hooks/useBreakpoint';

type Props = {};

const MintableBaseProfile = (props: Props) => {
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const { nftTemplateSetting } = useMagicContext();

  return (
    <section
      id="MintableBaseProfile"
      style={{ cursor: 'pointer' }}
      onClick={() => setSettingOpen(!settingOpen)}
    >
      <div className="shadow-xl px-5 mb-5 py-5 justify-center items-center h-fit rounded-full">
        <div className="flex gap-5 justify-center items-center">
          <h3>Select Background: </h3>
          <Select
            onChange={(value) => {
              setState(nftTemplateSetting)({
                ...selectState(nftTemplateSetting),
                backgroundType: value,
              });
              setSettingOpen(true);
            }}
            value={selectState(nftTemplateSetting).backgroundType}
            options={Object.keys(BackgroundVariant).map((variant) => ({
              label: variant,
              value: (BackgroundVariant as any)[variant],
            }))}
          />
        </div>
        <div style={{ width: '100%', ...MIDDLE_STYLE }} className="mt-5">
          {selectState(nftTemplateSetting).backgroundType ===
            BackgroundVariant.Image && (
            <BackgroundImageSetting
              onImageUpload={(imageItem: TFileImageItem) => {
                setState(nftTemplateSetting)({
                  ...selectState(nftTemplateSetting),
                  backgroundValue: imageItem.url,
                });
                setSettingOpen(true);
              }}
            />
          )}
          {selectState(nftTemplateSetting).backgroundType ===
            BackgroundVariant.Color && (
            <BackgroundGradientSetting
              onValueChange={(color: TCanvasGradientBackground) => {
                setState(nftTemplateSetting)({
                  ...selectState(nftTemplateSetting),
                  backgroundValue: color,
                });
                setSettingOpen(true);
              }}
            />
          )}
        </div>
      </div>
      <MagicBaseGridCard />
    </section>
  );
};

export default MintableBaseProfile;
