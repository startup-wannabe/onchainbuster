import React from 'react';
import MagicBaseGridCard from '../MagicBaseGridCard';
import BackgroundImageSetting from '../BackgroundImageSetting';
import { useMagicContext } from '@/app/hooks/useMagicContext';
import { selectState, setState } from '@/helpers';
import { Select } from 'antd';
import { BackgroundVariant } from '@/app/contexts/MagicContext';
import BackgroundGradientSetting from '../BackgroundGradientColorSetting';
import MagicButton from '../MagicButton';
import { Separator } from '@radix-ui/themes';
import { useMagic } from '@/app/hooks/useMagic';

type Props = {};

const BaseMinting = (props: Props) => {
  const {
    mutate: { handleDownloadImage },
  } = useMagic();
  const { nftTemplateSetting } = useMagicContext();

  return (
    <section className="flex">
      <div className="max-w-[400px] shadow-xl h-fit py-5 px-5 rounded-xl">
        <MagicButton
          text="Mint NFT 🎉"
          onClick={() => {
            console.log(selectState(nftTemplateSetting).ref?.current);
            // FIXME: Failed to fetch
            handleDownloadImage(
              selectState(nftTemplateSetting).ref,
              'nft',
              'png',
            );
          }}
        />
        <Separator size={'4'} className="mb-5 mt-5" />
        <Select
          style={{
            width: '100%',
          }}
          onChange={(value) => {
            setState(nftTemplateSetting)({
              ...selectState(nftTemplateSetting),
              backgroundType: value,
            });
          }}
          value={selectState(nftTemplateSetting).backgroundType}
          options={Object.keys(BackgroundVariant).map((variant) => ({
            label: variant,
            value: (BackgroundVariant as any)[variant],
          }))}
        />
        <div className="pt-5">
          {selectState(nftTemplateSetting).backgroundType ===
            BackgroundVariant.Image && (
            <BackgroundImageSetting
              onImageUpload={(imageItem: TFileImageItem) => {
                setState(nftTemplateSetting)({
                  ...selectState(nftTemplateSetting),
                  backgroundValue: imageItem.url,
                });
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
              }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          width: 500,
          height: 400,
          position: 'relative',
        }}
      >
        <MagicBaseGridCard
          style={{ scale: 0.4, position: 'absolute', top: -265, left: -335 }}
        />
      </div>
    </section>
  );
};

export default BaseMinting;
