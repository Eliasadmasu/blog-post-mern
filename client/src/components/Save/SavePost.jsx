import { useState } from "react";
import "./savepost.css";
import Cookies from "js-cookie";
import axios from "axios";
import { newTokenRefresher } from "../../tokenRefresher";

const SavePost = ({ postId }) => {
  const [saved, setSaved] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSaveClick = async () => {
    try {
      await newTokenRefresher();

      const accessToken = Cookies.get("authToken");
      if (!accessToken) {
        console.error("Access token not found. Please log in.", accessToken);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/blog/save/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <div>
      {saved ? (
        <button className="bookmarkBtn" onClick={handleSaveClick}>
          <span className="IconContainer">
            <svg viewBox="0 0 384 512" height="0.9em" className="icon">
              <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
            </svg>
          </span>
          <p className="text">Save</p>
        </button>
      ) : (
        <div>Post Saved</div>
      )}
    </div>
  );
};
export default SavePost;
