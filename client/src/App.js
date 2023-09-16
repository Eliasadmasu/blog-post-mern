import { useEffect } from "react";
import "./App.css";
import EditBlogPost from "./components/EditPost/EditBlogPost";
import Navbar from "./components/Navbar/Navbar";
import { useUserContext } from "./context/UserContext";
import AllBlogs from "./pages/Blogs/AllBlogs";
import Login from "./pages/Login/Login";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import SignUp from "./pages/SignUp/SignUp";
import Create from "./pages/createBlog/Create";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  const { user } = useUserContext();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<AllBlogs />} />
        {user ? (
          <Route path="/create" element={<Create />} />
        ) : (
          <Route path="/create" element={<Navigate to="/login" />} />
        )}
        {user ? (
          <Route path="/edit/:postId" element={<EditBlogPost />} />
        ) : (
          <Route path="/create" element={<Navigate to="/login" />} />
        )}

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Page not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
