import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { RiDeleteBin5Fill } from "react-icons/ri";
import axios from "axios";
import { newTokenRefresher } from "../../tokenRefresher";
import "./delete.css";

const DeletePost = ({ blogId, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async () => {
    try {
      await newTokenRefresher();

      const accessToken = Cookies.get("authToken");
      if (!accessToken) {
        console.error("Access token not found. Please log in.", accessToken);
        return;
      }

      // Make a DELETE request to your API to delete the blog post by ID
      const apiUrl = process.env.REACT_APP_API_URL;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(`${apiUrl}/blog/delete/${blogId}`, config);
      console.log("deleted Successfully");
      onDeleteSuccess(blogId);
      if (location.pathname === "/myblog") {
        navigate("/myblog");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting the blog post:", error);
    }
  };
  return (
    <div>
      <RiDeleteBin5Fill
        size={20}
        onClick={handleDelete}
        className="deleteBtn"
      />
    </div>
  );
};
export default DeletePost;
