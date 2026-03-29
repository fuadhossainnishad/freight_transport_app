const BASE_IMAGE_URL = "https://server.lawapantruck.com";

export const normalizeImageUrl = (url?: string) => {
    if (!url) return "";

    // replace localhost from backend
    const cleaned = url.replace("http://localhost:5000", BASE_IMAGE_URL);

    if (cleaned.startsWith("http")) return cleaned;

    return `${BASE_IMAGE_URL}${cleaned}`;
};