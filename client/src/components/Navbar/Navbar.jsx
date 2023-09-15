import { Link } from "react-router-dom";
import { AiOutlineAliwangwang } from "react-icons/ai";
import { ImSearch } from "react-icons/im";
import "./navbar.css";
import { useUserContext } from "../../context/UserContext";
import Cookies from "js-cookie";

const Navbar = () => {
  const { user, username, setUser, setUsername } = useUserContext();

  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("username");
    setUser(null); // Set user state to null
    setUsername(""); // Clear username
  };

  return (
    <div className="navCont">
      <Link to={"/"}>
        <AiOutlineAliwangwang size={35} className="icon" />
      </Link>
      <div className="searchCont">
        <input
          type="text"
          className="searchBar"
          placeholder="Search for Blogs"
        />
        <ImSearch className="searchIcon" />
      </div>
      {user ? (
        <div className="linkCont">
          <Link to={"/user"}>{username && username}</Link>
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
