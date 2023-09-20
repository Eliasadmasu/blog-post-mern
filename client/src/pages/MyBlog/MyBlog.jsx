import axios from "axios";
import { newTokenRefresher } from "../../tokenRefresher";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import DeletePost from "../../components/DeletePost/DeletePost";
import { ThreeDots } from "react-loader-spinner";
import "./myblog.css";

const MyBlog = () => {
  const [userPosts, setUserPosts] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);

  const fetchMyBlog = async () => {
    try {
      await newTokenRefresher();

      const accessToken = Cookies.get("authToken");
      if (!accessToken) {
        console.error("Access token not found. Please log in.", accessToken);
        return;
      }

      const response = await axios.get(`${apiUrl}/blog/mypost/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Replace with the actual JWT token
        },
      });
      setLoading(false);
      setUserPosts(response.data.userPost);
      console.log(response);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user posts:", error);
    }
  };
  useEffect(() => {
    fetchMyBlog();
  }, []);

  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  const handleDeleteSuccess = (deletedBlogId) => {
    // Remove the deleted blog post from the data array
    setUserPosts((prevData) =>
      prevData.filter((item) => item._id !== deletedBlogId)
    );
  };

  return (
    <div className="wholeCont">
      {/* {user && ( */}
      <Link to={"/create"} className="createPst">
        <button class="Btn1">
          <div class="sign">+</div>
          <div class="text"> Create</div>
        </button>
      </Link>
      {loading ? (
        <div className="loading">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#13a1c5"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      ) : userPosts.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <ul>
          {userPosts.map((post) => (
            <li key={post._id} className="singleCont">
              <h3>{post.title}</h3>
              {post.photo && (
                <img
                  className="blogImg"
                  src={`${apiUrl}/uploads/${post.photo}`}
                  alt={`${post.title}`}
                />
              )}

              <p dangerouslySetInnerHTML={renderHTML(post.content)} />
              <div className="fxdr">
                <Link to={`/edit/${post._id}`}>
                  <FaRegEdit size={20} />
                </Link>
                <DeletePost
                  blogId={post._id}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default MyBlog;
