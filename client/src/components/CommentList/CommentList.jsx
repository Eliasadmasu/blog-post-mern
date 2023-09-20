import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { newTokenRefresher } from "../../tokenRefresher";

const CommentList = ({ blogPostId }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        await newTokenRefresher();

        const accessToken = Cookies.get("authToken");
        if (!accessToken) {
          console.error("Access token not found. Please log in.", accessToken);
          return;
        }

        const response = await axios.get(
          `${apiUrl}/blog/comments/${blogPostId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setComments(response?.data);
        console.log(response.data[0].user.username);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [blogPostId]);

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.user.username}:</strong> {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CommentList;
