import "./pagenotfound.css";
import NotFoundImg from "../../assets/404-notFound.svg";

const PageNotFound = () => {
  return (
    <div className="NotFoundCont">
      <img src={NotFoundImg} alt="page not found" className="notfoundImg" />
      <p>The page you're looking for does not exist.</p>
    </div>
  );
};
export default PageNotFound;
