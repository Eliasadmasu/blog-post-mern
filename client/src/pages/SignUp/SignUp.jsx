import { useState } from "react";
import "./signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const onCreateAcoount = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/blog/register`, formData);
      // Successful registration
      console.log("Registration successful:", response.data);
      navigate("/login");
      // You can redirect the user or show a success message here
    } catch (err) {
      // Handle error response
      console.error("Registration error:", err.response);

      // Check for specific error messages from the server
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during registration.");
      }
    }
  };

  return (
    <div className="signUpCont">
      <form className="FormCnt" onSubmit={onCreateAcoount}>
        <h2> Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="inputLbl">
          <label>Username</label>
          <input type="text" name="username" onChange={handleChange} />
        </div>
        <div className="inputLbl">
          <label htmlFor="">Password</label>
          <input type="password" name="password" onChange={handleChange} />
        </div>
        <button type="submit" className="btnCA">
          Create Account
        </button>
      </form>
    </div>
  );
};
export default SignUp;
