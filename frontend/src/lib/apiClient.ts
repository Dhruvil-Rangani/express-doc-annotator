import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const baseURL = isLocalhost
  ? import.meta.env.VITE_BACKEND_DEV
  : import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
