import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const handleUnauthorizedAccess = (navigate) => {
  navigate("/login");
};

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

//!response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const navigate = useNavigate();
    if (error.response && error.response.status === 401) {
      const refreshToken = Cookies.get("refreshToken");

      if (!refreshToken) {
        handleUnauthorizedAccess(navigate);
        return Promise.reject(error);
      }

      // Request a new access token using the refresh token
      try {
        const refreshResponse = await api.post(`/blog/refresh`, {
          refreshToken,
        });

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.data.accessToken;

          // Update the access token in the cookies
          Cookies.set("authToken", newAccessToken, {
            expires: 1 / (24 * 60),
            secure: true,
            httpOnly: true,
          });

          // Retry the original request
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        // Handle any error during token renewal
        console.error("Token renewal error:", refreshError);
        handleUnauthorizedAccess(navigate); // Redirect to login in case of errors
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
