import axios from "axios";
import Cookies from "js-cookie";

export const newTokenRefresher = async () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  //refresh token
  try {
    const refreshToken = Cookies.get("refreshToken");
    const response = await axios.post(`${apiUrl}/blog/refresh`, {
      refreshToken,
    });
    const newAccessToken = response.data.accessToken;
    const UserName = response.data.User.username;

    Cookies.set("authToken", newAccessToken, { expires: 20 / 1440 });
    Cookies.set("username", UserName, { expires: 20 / 1440 });
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
};
