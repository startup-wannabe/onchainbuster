export const generatePinataKey = async () => {
  try {
    const tempKey = await fetch('/api/pinata/key', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const keyData = await tempKey.json();
    return keyData;
  } catch (error) {
    console.log('error making API key:', error);
    throw error;
  }
};

export async function uploadFile(
  selectedFile: File | undefined,
  keyToUse: string,
) {
  if (!selectedFile) {
    console.log('no file provided!');
    return;
  }
  try {
    const formData = new FormData();
    formData.append('file', selectedFile);

    const metadata = JSON.stringify({
      name: `${selectedFile.name}`,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    const uploadRes = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keyToUse}`,
        },
        body: formData,
      },
    );
    console.log({ uploadResStatus: uploadRes.status });
    if (uploadRes.status !== 200) {
      throw Error;
    }
    const uploadResJson = await uploadRes.json();
    return uploadResJson.IpfsHash;
  } catch (error) {
    console.log('Error uploading file:', error);
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
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keyToUse}`,
        },
        body: data,
      },
    );
    const uploadResJson = await uploadRes.json();
    const cid = uploadResJson.IpfsHash;
    console.log(cid);
    return cid;
  } catch (error) {
    console.log('Error uploading file:', error);
  }
}
