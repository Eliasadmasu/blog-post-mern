import axios from "axios";
import { useEffect, useState } from "react";
import "./allblog.css";
// import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { newTokenRefresher } from "../../tokenRefresher";
import Cookies from "js-cookie";
import { ImSearch } from "react-icons/im";
// import DeletePost from "../../components/DeletePost/DeletePost";
import { ThreeDots } from "react-loader-spinner";
import { useUserContext } from "../../context/UserContext";

const AllBlogs = () => {
  const [data, setData] = useState([]);
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(true);
  //search
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  // const handleDeleteSuccess = (deletedBlogId) => {
  //   // Remove the deleted blog post from the data array
  //   setData((prevData) =>
  //     prevData.filter((item) => item._id !== deletedBlogId)
  //   );
  // };

  useEffect(() => {
    const FetchedData = async () => {
      try {
        //token refresh before fethching the blog post
        await newTokenRefresher(() => {
          console.log("refreshed token");
        });

        //check if the token exist
        const accessToken = Cookies.get("authToken");

        if (!accessToken) {
          console.error("Access token not found. Please log in.", accessToken);
          return;
        }

        const res = await axios.get(`${apiUrl}/blog/all`);
        setUser(accessToken);
        setLoading(false);
        console.log(res.data);
        setData(res.data);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    FetchedData();
  }, []);
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  const formatDate = (isoDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };

  const filterdData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="wholeCont">
      {/* {user && (
        <Link to={"/create"} className="createPst">
          Create Post
        </Link>
      )} */}
      <div className="searchCont">
        <input
          type="text"
          className="searchBar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for Blogs"
        />
        <ImSearch className="searchIcon" />
      </div>

      {!loading ? (
        filterdData.map((item) => (
          <div key={item._id} className="singleCont">
            <div className="blogTitle">{item.title}</div>
            {item.photo && (
              <img
                className="blogImg"
                src={`${apiUrl}/uploads/${item.photo}`}
                alt={`${item.title}`}
              />
            )}

            <div
              className="blogDetail"
              dangerouslySetInnerHTML={renderHTML(item.content)}
            />
            <div className="df">
              <div className="blogCreatedDate">
                Posted: {formatDate(item.date)}
              </div>
              {/* <Link to={`/edit/${item._id}`}>
                <FaRegEdit size={20} />
              </Link>
              <DeletePost
                blogId={item._id}
                onDeleteSuccess={handleDeleteSuccess}
              /> */}
            </div>
          </div>
        ))
      ) : (
        <div className="loading">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#13a1c5"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      )}
    </div>
  );
};
export default AllBlogs;
