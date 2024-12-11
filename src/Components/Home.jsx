import { FaArrowDown } from "react-icons/fa";
import "./Home.css";
import AnchorLink from "react-anchor-link-smooth-scroll";

const Home = () => {
  return (
    <div>
      <p className="introduction">
        Hi!, I am <span className="name">Mohan Sai</span>, an innovative
        researcher in learning new skills
        <AnchorLink href="#page2">
          <FaArrowDown />
        </AnchorLink>
      </p>
    </div>
  );
};

export default Home;
