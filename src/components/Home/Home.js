import { Link } from "react-router-dom";
import './Home.css';

function Home() {
  return (
    <div className="home-container">
       <h1 className="home-title">BlastX Page Speed Revenue Calculator</h1>
       <button className="home-start-btn">
            <Link to={'/questions'} className="home-start-btn-text" >Get Started</Link>
       </button>
    </div>
  );
}

export default Home;
