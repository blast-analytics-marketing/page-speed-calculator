import { Link } from "react-router-dom";
import { useSinglePrismicDocument } from '@prismicio/react';

import './Home.css';

function Home() {

  const [document, { state }] = useSinglePrismicDocument('homepage')
  console.log(document)
  return (
    <div className="home-container">
      {
        state === 'loading' ? (<p>Loading...</p>)
        : (
        document && <div><h1 className="home-title">{document.data.title}</h1>
        <button className="home-start-btn">
            <Link to={'/questions'} className="home-start-btn-text" >{document.data.start_cta}</Link>
        </button></div>
        )
      }
    </div>

    // <div className="home-container">
    //    document &<h1 className="home-title">{ "test" || document.data.title}r</h1>
    //    <button className="home-start-btn">
    //         <Link to={'/questions'} className="home-start-btn-text" >{cmsContent.start_cta}</Link>
    //    </button>
    // </div>
  );
}

export default Home;
