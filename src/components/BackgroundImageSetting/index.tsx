import React from "react";
import { IMAGE_BACKGROUNDS } from "@assets/image-backgrounds";
import { Space } from "antd";
import { fetchImageBuffer } from "@/helpers/canvas.helper";
import { makeid } from "@/helpers";
import ImageItemCard from "../ImageItemCard";

type Props = {
  onImageUpload: (uploadedImageItems: TFileImageItem) => void;
};

const BackgroundImageSetting = ({ onImageUpload }: Props) => {
  // console.log(IMAGE_BACKGROUNDS);
  const handleTemplateImageClicked = async (imageUrl: string) => {
    const { arrayBuffer, base64 } = await fetchImageBuffer(imageUrl);
    onImageUpload({
      id: Date.now() + Math.floor(Math.random() * 100000),
      data: arrayBuffer,
      url: `data:jpeg;base64,${base64}`,
      extension: "jpeg",
      name: `Background Image ${makeid(5)}`,
    });
  };

  return (
    <React.Fragment>
      <Space style={{ flexWrap: "wrap" }}>
        {IMAGE_BACKGROUNDS.map((imageBackground) => (
          <React.Fragment>
            <ImageItemCard
              onClick={(data) => handleTemplateImageClicked(data)}
              style={{
                width: 80,
                height: "100%",
                margin: 0,
              }}
              data={imageBackground.src}
            />
          </React.Fragment>
        ))}
      </Space>
    </React.Fragment>
  );
};

export default BackgroundImageSetting;
