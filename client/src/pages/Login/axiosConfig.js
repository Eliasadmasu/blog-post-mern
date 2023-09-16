import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const handleUnauthorizedAccess = (navigate) => {
  navigate("/loginS");
};

api.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get("authToken");

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
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
  async (error) => {
    const navigate = useNavigate();
    if (error.response && error.response.status === 401) {
      const refreshToken = Cookies.get("refreshToken");
      const { updateUser } = useUserContext();
      updateUser(null, null);

      //   if (!refreshToken) {
      handleUnauthorizedAccess(navigate);
      //   return Promise.reject(error);
      //   }

      // Request a new access token using the refresh token
      try {
        const refreshResponse = await api.post(`/blog/refresh-token`, {
          refreshToken,
        });

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.data.token;

          // Update the access token in the cookies
          Cookies.set("authToken", newAccessToken, {
            expires: 5 / (24 * 60),
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
