export const generatePinataKey = async () => {
  try {
    const tempKey = await fetch("/api/pinata/key", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const keyData = await tempKey.json();
    return keyData;
  } catch (error) {
    console.log("error making API key:", error);
    throw error;
  }
};
export async function uploadFile(
  imageName: string,
  imageBlob: Blob | undefined,
  keyToUse: string
) {
  if (!imageBlob) {
    console.log("no file provided!");
    return;
  }
  try {
    const formData = new FormData();
    formData.append("file", imageBlob, `${imageName}.png`);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", options);
    const uploadRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keyToUse}`,
        },
        body: formData,
      }
    );
    console.log({ uploadResStatus: uploadRes.status });
    if (uploadRes.status !== 200) {
      throw Error;
    }
    const uploadResJson = await uploadRes.json();
    return uploadResJson.IpfsHash;
  } catch (error) {
    console.log("Error uploading file:", error);
  }
}

export async function uploadJson(content: any, keyToUse: string) {
  try {
    const data = JSON.stringify({
      pinataContent: {
        name: content.name,
        description: content.description,
        image: `ipfs://${content.image}`,
        external_url: content.external_url,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    const uploadRes = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keyToUse}`,
        },
        body: data,
      }
    );
    const uploadResJson = await uploadRes.json();
    const cid = uploadResJson.IpfsHash;
    console.log(cid);
    return cid;
  } catch (error) {
    console.log("Error uploading file:", error);
  }
}

export const dataURLtoBlob = (dataURL: string) => {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};
