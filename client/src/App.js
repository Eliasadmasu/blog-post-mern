import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AllBlogs from "./pages/Blogs/AllBlogs";
import Create from "./pages/createBlog/Create";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<AllBlogs />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
}

export default App;
