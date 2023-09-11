import { useState } from "react";
import axios from "axios";
import "./create.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const apiUrl = process.env.REACT_APP_API_URL;
const Create = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setPhoto(selectedFile);
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
        },
      });
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
          className="fileUpload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" className="Btn">
          Create Blog Post
        </button>
      </form>{" "}
    </div>
  );
};
export default Create;
