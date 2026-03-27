import axios from "axios";

const apiClient = axios.create({
  // Vite uses import.meta.env instead of process.env
  baseURL: "http://localhost:5000/api", //import.meta.env.VITE_API_URL ||
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("emr_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
