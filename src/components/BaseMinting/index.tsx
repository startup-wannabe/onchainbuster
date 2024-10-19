import { BackgroundVariant } from "@/app/contexts/MagicContext";
import { MIDDLE_STYLE } from "@/app/hooks/useBreakpoint";
import { useMagicContext } from "@/app/hooks/useMagicContext";
import { selectState, setState } from "@/helpers";
import {
  generateJSXMeshGradient,
  generateRandomRgbaStr,
} from "@/helpers/gradient.helper";
import { Select } from "antd";
import BackgroundGradientSetting from "../BackgroundGradientColorSetting";
import BackgroundImageSetting from "../BackgroundImageSetting";
import MagicBaseGridCard from "../MagicBaseGridCard";
import MagicButton from "../MagicButton";

type Props = {};

const MintableBaseProfile = (props: Props) => {
  const { nftTemplateSetting } = useMagicContext();

  return (
    <section id="MintableBaseProfile" style={{ cursor: "pointer" }}>
      <div className="shadow-xl px-5 mb-5 py-5 justify-center items-center h-fit rounded-full">
        <div className="flex gap-5 justify-center items-center">
          <h3>Select Background: </h3>
          <Select
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
          {selectState(nftTemplateSetting).backgroundType ===
            BackgroundVariant.Color && (
            <MagicButton
              text={"Generate ✨"}
              style={{ width: "100%", marginBottom: 10 }}
              onClick={() => {
                setState(nftTemplateSetting)({
                  ...selectState(nftTemplateSetting),
                  backgroundValue: generateJSXMeshGradient(
                    50,
                    generateRandomRgbaStr()
                  ).backgroundColor,
                });
              }}
            />
          )}
        </div>
        <div style={{ width: "100%", ...MIDDLE_STYLE }} className="mt-5">
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
      <MagicBaseGridCard />
    </section>
  );
};

export default MintableBaseProfile;
