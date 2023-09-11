import { Link } from "react-router-dom";
import { AiOutlineAliwangwang } from "react-icons/ai";
import "./navbar.css";

const Navbar = () => {
  return (
    <div className="navCont">
      <Link to={"/"}>
        <AiOutlineAliwangwang size={35} className="icon" />
      </Link>
      <Link to={"/create"} className="create">
        Create Post
      </Link>
      <div className="linkCont">
        <Link>Login</Link>
        <Link>Register</Link>
      </div>
    </div>
  );
};
export default Navbar;
