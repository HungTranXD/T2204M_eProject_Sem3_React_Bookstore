export const addAutoWidthTransformation = (originalUrl) => {
    const autoWidthParam = "w_auto";
    const parts = originalUrl.split("/");

    // Find the index of "upload" in the URL
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex !== -1) {
        // Insert "w_auto" before "upload"
        parts.splice(uploadIndex, 0, autoWidthParam);
    }

    // Join the parts back together to create the transformed URL
    return parts.join("/");
};