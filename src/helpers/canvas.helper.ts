export const fetchImageBuffer = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  return {
    arrayBuffer,
    base64: Buffer.from(arrayBuffer).toString('base64'),
  };
};
