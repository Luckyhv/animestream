import React, { useRef, useState, useEffect } from 'react';
// import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';
import { useDraggable } from 'react-use-draggable-scroll';
import '../styles/Animecard.css';
import { Link } from 'react-router-dom';
import axios from 'axios'
import Animecardskeleton from '../skeletons/Animecardskeleton';

function Animecard({ url }) {
  const ref = useRef();
  const { events } = useDraggable(ref);
  const [animedata, setanimedata] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAnimeData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}meta/anilist/${url}`, {
        params: {
          page: 1,
          perPage: 20,
        }
      });
      // console.log(res.data);
        setanimedata(res.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnimeData();
  }, []);

  // const [showLeftArrow, setShowLeftArrow] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const shouldShowLeftArrow = ref.current.scrollLeft > 0;

  //     // Only update state if there's a change to avoid rapid toggling
  //     if (shouldShowLeftArrow !== showLeftArrow) {
  //       setShowLeftArrow(shouldShowLeftArrow);
  //     }
  //   };

  //   // ref.current.addEventListener('scroll', handleScroll);

  //   // return () => {
  //   //   ref.current.removeEventListener('scroll', handleScroll);
  //   // };
  // }, [showLeftArrow]);

  // const handlescroll = (direction) => {
  //   const currentScrollLeft = ref.current.scrollLeft;
  //   const scrollAmount = direction === 'left' ? -500 : 500;

  //   ref.current.scrollTo({
  //     left: currentScrollLeft + scrollAmount,
  //     behavior: 'smooth',
  //   });
  // };

  if(loading){
    return (
      <div className="" ref={ref} {...events}>
        <Animecardskeleton />
      </div>
    )
  }

  return (
    <div className="animecard">
      <div className="animecardcontainer">
        {/* {showLeftArrow && (
          <div className="arrow left" onClick={() => handlescroll('left')}>
            <ChevronLeftIcon className="arrow-icon" />
          </div>
        )} */}
        <div className="animecarditems" {...events} ref={ref}>
          {animedata.map((anime) => (
            <div key={anime.id} className="animecarditem">
              <Link to={`/info/${anime.id}`}>
                <img src={anime.image} alt={anime.title.english} className='animecardimg' />
              </Link>
              <div className="animecard-content">
                <p className='animecardtitle'>
                  {anime.title.english
                    ? anime.title.english
                    : anime.title.romaji}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="arrow right" onClick={() => handlescroll('right')}>
          <ChevronRightIcon className="arrow-icon" />
        </div> */}
      </div>
    </div>
  );
}

export default Animecard;
