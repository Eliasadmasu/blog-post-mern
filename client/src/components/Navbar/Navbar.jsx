import { Link, useNavigate } from "react-router-dom";
import { AiOutlineAliwangwang } from "react-icons/ai";
import { ImSearch } from "react-icons/im";
import "./navbar.css";
import { useUserContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import { newTokenRefresher } from "../../tokenRefresher";
import { useEffect } from "react";

const Navbar = () => {
  const { user, username, setUser, setUsername } = useUserContext();
  const navigate = useNavigate();

  const newAccessToken = async () => {
    await newTokenRefresher();

    const accessToken = Cookies.get("authToken");
    const username = Cookies.get("username");
    if (!accessToken) {
      console.error("Access token not found. Please log in.", accessToken);
      return;
    }

    setUser(accessToken);
    setUsername(username);
  };

  useEffect(() => {
    newAccessToken();
  }, []);

  const logout = () => {
    navigate("/login"); // Initiate navigation
    Cookies.remove("authToken");
    Cookies.remove("username");
    Cookies.remove("refreshToken");
    setUser(null); // Set user state to null
    setUsername(""); // Clear username
    return; // Exit the function to prevent further code execution
  };

  return (
    <div className="navCont">
      <Link to={"/"}>
        <AiOutlineAliwangwang size={35} className="icon" />
      </Link>

      {user ? (
        <div className="linkCont">
          <Link to={"/myblog"}>{username && username}</Link>
          <Link onClick={logout}>Logout</Link>
        </div>
      ) : (
        <div className="linkCont">
          <Link to={"/login"}>Login</Link>
          <Link to={"/signup"}>Register</Link>
        </div>
      )}
    </div>
  );
};
export default Navbar;
