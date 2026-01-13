const rawUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_BASE_URL = rawUrl.replace(/\/+$/, '');  // Remove trailing slash(es)
export default API_BASE_URL;
