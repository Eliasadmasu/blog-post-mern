import { useState } from "react";
import axios from "axios";
import { newTokenRefresher } from "../../tokenRefresher";
import Cookies from "js-cookie";

const CommentForm = ({ blogPostId }) => {
  const [commentText, setCommentText] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      await newTokenRefresher();

      const accessToken = Cookies.get("authToken");
      if (!accessToken) {
        console.error("Access token not found. Please log in.", accessToken);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/blog/comments`,
        {
          text: commentText,
          blogPostId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCommentText("");
      console.log(response);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add your comment"
        required
      ></textarea>
      <button type="submit">Submit Comment</button>
    </form>
  );
};
export default CommentForm;
