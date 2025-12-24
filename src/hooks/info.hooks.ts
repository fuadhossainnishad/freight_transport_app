// import { useState, useEffect } from "react";
// import { showError, showSuccess } from "../utils/toast.utils";

// export default function useInfo(slug: string) {
//     const [html, setHtml] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadData();
//     }, [slug]);

//     const loadData = async () => {
//         try {
//             const res = await fetchCMSContent(slug);
//             setHtml(res.data.htmlContent);
//             showSuccess("Content loaded successfully.");
//         } catch (error) {
//             showError("Failed to load content!");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { html, loading };
// }
