
export const downloadImage = async (url, filename) => {
  try {
    console.log(`Starting download for ${url}`);

    // First, try to fetch with CORS mode
    let response = await fetch(url, {
      mode: 'cors',
      cache: 'no-store',
    });

    // If CORS fails, try again with no-cors mode
    if (!response.ok) {
      console.log("CORS request failed, trying no-cors mode");
      response = await fetch(url, {
        mode: 'no-cors',
        cache: 'no-store',
      });
    }

    if (!response.ok && response.type !== 'opaque') {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    console.log(`Successfully fetched image blob of size: ${blob.size} bytes`);

    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename || 'downloaded-image.png';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      console.log(`Download initiated for ${filename}`);
    }, 200);

  } catch (error) {
    console.error("Error downloading image:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};
