import axios from "axios";
import { useEffect, useState } from "react";
import "./allblog.css";

const AllBlogs = () => {
  const [data, setData] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  const FetchedData = async () => {
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
  return (
    <div className="wholeCont">
      {data.map((item) => (
        <div key={item._id} className="singleCont">
          <div className="blogTitle">{item.title}</div>
          <img
            className="blogImg"
            src={`${apiUrl}/uploads/${item.photo}`}
            alt={`${item.title}`}
          />
          {/* <div className="blogDetail">{item.content}</div> */}
          <div
            className="blogDetail"
            dangerouslySetInnerHTML={renderHTML(item.content)}
          />
          <div className="blogCreatedDate">{item.date}</div>
        </div>
      ))}
    </div>
  );
};
export default AllBlogs;
