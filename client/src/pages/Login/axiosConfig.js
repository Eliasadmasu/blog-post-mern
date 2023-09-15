import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "https://localhost:5000",
});

api.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get("authToken");

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const navigate = useNavigate();
    if (error.response && error.response.status === 401) {
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
