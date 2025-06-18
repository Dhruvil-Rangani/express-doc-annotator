import axios from "axios";

const baseURL ='/api';

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
