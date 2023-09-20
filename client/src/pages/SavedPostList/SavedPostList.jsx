import { useEffect, useState } from "react";
import { newTokenRefresher } from "../../tokenRefresher";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import "./savedpostList.css";

const SavedPostList = () => {
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        await newTokenRefresher();

        const accessToken = Cookies.get("authToken");

        if (!accessToken) {
          console.error("Access token not found. Please log in.", accessToken);
          return;
        }

        const response = await axios.get(`${apiUrl}/blog/savedList`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data) {
          setSavedPosts(response.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching saved posts:", error);
      }
    };
    fetchSavedPosts();
  }, []);

  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  const formatDate = (isoDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };
  return (
    <div>
      {!loading ? (
        <div className="formCont">
          {savedPosts.map((post) => (
            <li key={post._id} className="singleCont">
              <h3 className="blogImg">{post.title}</h3>
              {post.photo && (
                <img
                  className="blogImg"
                  src={`${apiUrl}/uploads/${post.photo}`}
                  alt={`${post.title}`}
                />
              )}
              <p
                className="blogDetail"
                dangerouslySetInnerHTML={renderHTML(post.content)}
              />
              <div className="blogCreatedDate">
                Posted: {formatDate(post.date)}
              </div>
            </li>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};
export default SavedPostList;
