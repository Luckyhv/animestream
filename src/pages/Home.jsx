import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from '../components/Carousel';
import '../styles/Home.css';
import CarouselSkeleton from '../skeletons/CarouselSkeleton';
import Animecard from '../components/Animecard';
import Currentlywatching from '../components/Currentlywatching';

function Home() {
  const [animedata, setAnimedata] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getAnimedata();
  }, []);

  return (
    <div className='home'>
      <div className="homecontainer carousel">
        <p className='hometitle'><span>M</span>OST VIEWED</p>
        {loading && <CarouselSkeleton />}
        {!loading && <Carousel animedata={animedata} />}
      </div>
        <Currentlywatching/>
      <div className="homecontainer">
        <p className='hometitle'><span>R</span>ecently Updated </p>
        <Animecard url={`recent-episodes`} />
      </div>
      <div className="homecontainer">
        <p className='hometitle'><span>T</span>rending Today</p>
        <Animecard url={`trending`} />
      </div>
      <div className="homecontainer">
        <p className='hometitle'><span>P</span>opular Anime</p>
        <Animecard url={`popular`} />
      </div>
    </div>
  );
}

export default Home;
