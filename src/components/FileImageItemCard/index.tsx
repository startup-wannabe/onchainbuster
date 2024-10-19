/* eslint-disable jsx-a11y/alt-text */
import type React from "react";

type ImageCardItemProps = {
  item: TFileImageItem;
  isSelected?: boolean;
  style?: React.CSSProperties;
  onClick?: (item: TFileImageItem) => void;
};

const FileImageItemCard = ({
  style,
  item,
  isSelected,
  onClick,
}: ImageCardItemProps) => {
  return (
    <div
      style={{
        width: 300,
        objectFit: "cover",
        margin: "5px 5px",
        cursor: "pointer",
        borderRadius: 10,
        height: "100%",
        overflow: "hidden",
        padding: "5px",
        ...style,
        ...(isSelected ? { border: `6px solid blue` } : {}),
      }}
      onClick={() => onClick && onClick(item)}
    >
      <img
        src={`${item.url}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: 10,
        }}
      />
    </div>
  );
};

export default FileImageItemCard;
