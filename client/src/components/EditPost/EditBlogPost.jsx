import axios from "axios";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "./editblog.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../../pages/createBlog/create.css";
import { useUserContext } from "../../context/UserContext";

const EditBlogPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const { user } = useUserContext();

  //states
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const header = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user}`,
          },
        };
        const response = await axios.get(
          `${apiUrl}/blog/get/${postId}`,
          header
        );
        const { title, content, photo } = response.data;
        setTitle(title);
        setContent(content);
        setPhoto(photo);
        console.log({ fetchbyid: response });
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogPost();
  }, [postId, apiUrl]);

  const handleInputChange = (e) => {
    if (e.target.name === "title") {
      setTitle(e.target.value);
    } else if (e.target.name === "photo") {
      // Update the selected photo
      setNewPhoto(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (newPhoto) {
      formData.append("photo", newPhoto);
    }

    try {
      const response = await axios.put(
        `${apiUrl}/blog/update/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user}`,
          },
        }
      );
      navigate("/");
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="formCont">
      <form onSubmit={handleUpdate} className="form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          className="title"
          onChange={handleInputChange}
        />
        <ReactQuill
          className="textEditor"
          theme="snow"
          value={content}
          onChange={setContent}
        />
        <img
          className="blogImg"
          src={photo ? `${apiUrl}/uploads/${photo}` : ""}
          alt={`${title}`}
        />
        <input
          className="fileUpload"
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleInputChange}
        />
        <button className="Btn" type="submit">
          Update Blog Post
        </button>
      </form>
    </div>
  );
};
export default EditBlogPost;
