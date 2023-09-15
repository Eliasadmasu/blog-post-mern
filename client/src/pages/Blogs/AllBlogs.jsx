import axios from "axios";
import { useEffect, useState } from "react";
import "./allblog.css";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

const AllBlogs = () => {
  const [data, setData] = useState([]);
  const { user } = useUserContext();

  const apiUrl = process.env.REACT_APP_API_URL;

  const FetchedData = async () => {
    // const headers = {
    //   headers: {
    //     Authorization: `Bearer ${user}`,
    //   },
    // };
    const res = await axios.get(`${apiUrl}/blog/all`);
    console.log(res.data);
    setData(res.data);
  };
  useEffect(() => {
    FetchedData();
  }, []);
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  const formatDate = (isoDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };

  return (
    <div className="wholeCont">
      {user && (
        <Link to={"/create"} className="createPst">
          Create Post
        </Link>
      )}

      {data.map((item) => (
        <div key={item._id} className="singleCont">
          <div className="blogTitle">{item.title}</div>
          <img
            className="blogImg"
            src={`${apiUrl}/uploads/${item.photo}`}
            alt={`${item.title}`}
          />
          <div
            className="blogDetail"
            dangerouslySetInnerHTML={renderHTML(item.content)}
          />
          <div className="df">
            <div className="blogCreatedDate">
              Posted: {formatDate(item.date)}
            </div>
            <Link to={`/edit/${item._id}`}>
              <FaRegEdit size={20} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AllBlogs;
