import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from '../components/Carousel';
import '../styles/Home.css';
import CarouselSkeleton from '../skeletons/CarouselSkeleton';
import Animecard from '../components/Animecard';
import Currentlywatching from '../components/Currentlywatching';
import { Link } from 'react-router-dom';
import Verticalcard from '../components/Verticalcard';

function Home() {
  const [animedata, setAnimedata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('seasonal');

  const getAnimedata = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}meta/anilist/trending`
      );

      if (res.data && res.data.results) {
        const data = res.data.results;
        setAnimedata(data);
      } else {
        console.error("Invalid response: ", res.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  useEffect(() => {
    getAnimedata();
  }, []);

  return (
    <div className='home'>
      <div className="homecontainer carousel">
      {/* <div className='hometitle'><div><span>M</span>ost Viewed </div></div> */}
        {loading && <CarouselSkeleton />}
        {!loading && <Carousel animedata={animedata} />}
      </div>
        <Currentlywatching/>
      <div className="homecontainer">
      <div className='hometitle'><div><span>R</span>ecently Updated </div><Link to={`/recent-episodes`} className='viewall'>View All</Link></div>
        <Animecard url={`recent-episodes`} />
      </div>
      <div className="homecontainer">
        <div className='hometitle'><div><span>T</span>rending Now </div><Link to={`/trending`} className='viewall'>View All</Link></div>
        <Animecard url={`trending`} />
      </div>
      {/* <div className="homecontainer">
        <div className='hometitle'><div><span>A</span>ll Time Popular </div><Link to={`/popular`} className='viewall'>View All</Link></div>
        <Animecard url={`popular`} />
      </div> */}
      <div className="homecontainer">
        <div className='hometitle'><div><span>T</span>op Anime </div> <div className="tbtns">
        <button
              className={activeButton === 'seasonal' ? 'selectedbtn' : 'notselectedbtn'}
              onClick={() => handleButtonClick('seasonal')}
            >
              Seasonal
            </button>
            <button
              className={activeButton === 'alltime' ? 'selectedbtn' : 'notselectedbtn'}
              onClick={() => handleButtonClick('alltime')}
            >
              All Time
            </button>
          </div> </div>
        <Verticalcard activeButton={activeButton}/>
      </div>
    </div>
  );
}

export default Home;
