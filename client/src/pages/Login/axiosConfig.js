import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

//!request
api.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get("authToken");

    // bearer auth
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
