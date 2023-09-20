import { useEffect, useState } from "react";
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
import { newTokenRefresher } from "./tokenRefresher";
import Cookies from "js-cookie";
import MyBlog from "./pages/MyBlog/MyBlog";
import SavedPostList from "./pages/SavedPostList/SavedPostList";

function App() {
  const { user, setUser, refreshToken, setRefreshToken } = useUserContext();
  console.log({ user, refreshToken });

  const OnStart = async () => {
    await newTokenRefresher();

    const accessToken = Cookies.get("authToken");
    const RefreshToken = Cookies.get("refreshToken");

    if (!accessToken) {
      console.error("Access token not found. Please log in.");
      return;
    }

    setUser(accessToken);
    setRefreshToken(RefreshToken);
  };

  useEffect(() => {
    OnStart();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            refreshToken ? <AllBlogs /> : <Navigate replace to={"/login"} />
          }
        />
        {refreshToken && <Route path="/" element={<Navigate to="/login" />} />}
        {user ? (
          <Route path="/create" element={<Create />} />
        ) : (
          <Route path="/create" element={<Navigate to="/login" />} />
        )}

        <Route
          path="/edit/:postId"
          element={user ? <EditBlogPost /> : <Navigate replace to={"/login"} />}
        />

        <Route
          path="/myblog"
          element={user ? <MyBlog /> : <Navigate replace to={"/login"} />}
        />
        <Route
          path="/savedList"
          element={
            user ? <SavedPostList /> : <Navigate replace to={"/login"} />
          }
        />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Page not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
