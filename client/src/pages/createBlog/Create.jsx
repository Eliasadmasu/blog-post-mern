import { useState } from "react";
import axios from "axios";
import "./create.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_API_URL;
const Create = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  const { user, setUser, refreshToken } = useUserContext();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("photo", photo);
    try {
      const response = await axios.post(`${apiUrl}/blog/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user}`,
        },
      });
      if (response.status === 200) {
        navigate("/");
      } else if (response.status === 401) {
        const refreshResponse = await axios.post("/api/refresh", {
          refreshToken,
        });

        if (refreshResponse.status === 200) {
          const newData = refreshResponse.data;
          setUser(newData.accessToken);
          Cookies.set("authToken", newData.accessToken, {
            expires: 1 / (24 * 60), // Expiration time in days
            secure: true, // Enable this for HTTPS
            httpOnly: true, // Restrict access to JavaScript
          });

          console.log(newData.message);
        } else {
          console.error("Refresh failed");
        }
      } else {
        console.error("Protected route error");
      }
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="formCont">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          className="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          className="textEditor"
          theme="snow"
          value={content}
          onChange={setContent}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="fileInput"
        />
        <button type="submit" className="Btn">
          Create Blog Post
        </button>
      </form>
    </div>
  );
};
export default Create;
