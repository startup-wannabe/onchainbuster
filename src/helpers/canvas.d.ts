type TFileImageItem = {
  id: number;
  url: string;
  extension: string;
  name: string;
  data: ArrayBuffer;
  uploadToken?: string;
};

type TCanvasImageBackground = TFileImageItem;

type TCanvasGradientBackground = string;

type TNftTemplateSetting = {
  ref?: React.MutableRefObject<HTMLDivElement | null> | undefined;
  backgroundValue: string;
  backgroundType: BackgroundVariant;
};
