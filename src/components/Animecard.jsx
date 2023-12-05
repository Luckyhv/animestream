import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/free-mode';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Animecardskeleton from '../skeletons/Animecardskeleton';
import '../styles/Animecard.css';
import { useDraggable } from 'react-use-draggable-scroll';
import { FreeMode } from 'swiper/modules';

function Animecard({ url }) {
  const [animedata, setanimedata] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();
  const { events } = useDraggable(containerRef);

  const getAnimeData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}meta/anilist/${url}`, {
        params: {
          page: 1,
          perPage: 20,
        },
      });
      setanimedata(res.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnimeData();
  }, []);

  if (loading) {
    return (
      <div className="" {...events} ref={containerRef}>
        <Animecardskeleton />
      </div>
    );
  }

  return (
    <div className="animecard">
      <div className="animecardcontainer" >
        <Swiper slidesPerView="auto" grabCursor freeMode={{ enabled: true, momentum: true, momentumRatio:0.8 }} modules={[FreeMode]}>
          {animedata.map((anime) => (
            <SwiperSlide key={anime.id} className="animecarditem" {...events} ref={containerRef}>
              <Link to={`/info/${anime.id}`}>
                <img src={anime.image} alt={anime.title.english} className="animecardimg" />
              </Link>
              <div className="animecard-content">
                <p className="animecardtitle">
                  {anime.title.english ? anime.title.english : anime.title.romaji}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Animecard;
