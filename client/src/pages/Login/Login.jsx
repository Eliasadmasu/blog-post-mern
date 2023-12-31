import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUserContext } from "../../context/UserContext";
import api from "./axiosConfig";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  // Usercontext
  const { setUser, setUsername, setRefreshToken } = useUserContext();
  // Usercontext

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/blog/login`, formData);
      // Successful registration
      console.log("Login successful:", response);
      if (response.status === 200) {
        setError("");
        navigate("/");
        const { token, refreshToken } = response.data;
        const { username } = response.data.user;
        setRefreshToken(refreshToken);
        console.log({ refreshToken });
        Cookies.set("authToken", token, {
          expires: 20 / 1440, // Expiration time in days
          secure: true, // Enable this for HTTPS
        });
        Cookies.set("refreshToken", refreshToken, {
          expires: 1 / 24, // Expiration time in days
          secure: true, // Enable this for HTTPS
        });

        Cookies.set("username", username, { expires: 20 / 1440 });
        setUser(token);
        setUsername(username);
      }
    } catch (err) {
      // Handle error response
      console.error("Login error:", err.response);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during Login.");
      }
    }
  };

  return (
    <div className="signUpCont">
      <form className="FormCnt" onSubmit={handleLogin}>
        <h2> Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="inputLbl">
          <label>Username</label>
          <input type="text" name="username" onChange={handleChange} />
        </div>
        <div className="inputLbl">
          <label htmlFor="">Password</label>
          <input type="password" name="password" onChange={handleChange} />
        </div>
        <button type="submit" className="btnCA">
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
