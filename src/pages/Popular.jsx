import React, { useRef, useState, useEffect } from 'react';
import '../styles/Trending.css';
import axios from 'axios';
import Viewallcard from '../components/Viewallcard';
import Viewallskeleton from '../skeletons/Viewallskeleton';

function Trending() {
  const [animedata, setanimedata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setpage] = useState(1);
  const [hasnextpage, sethasnextpage] = useState(true);

  const timerRef = useRef(null);

  const getAnimeData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}meta/anilist/popular`, {
        params: {
          page: page,
          perPage: 20,
        },
      });
      if (page > 1) {
        setanimedata((prevData) => [...prevData, ...res.data.results]);
        sethasnextpage(res.data.hasNextPage);
      } else {
        setanimedata(res.data.results);
        sethasnextpage(res.data.hasNextPage);
        console.log(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // }, [])

  useEffect(() => {
    getAnimeData();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!hasnextpage) {
          window.removeEventListener('scroll', handleScroll);
          return;
        }
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 3) {
          setpage((prevPage) => prevPage + 1);
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasnextpage]);


  return (
    <>
    <div className='viewallitems'>
        {animedata?.length===0 && <Viewallskeleton/>}
      {animedata.map((anime) => (
        <Viewallcard key={anime.id} anime={anime} />
        ))}
      {loading && hasnextpage && <Viewallskeleton/>}
    </div>
      <div style={{display:"flex",alignItems:"center"}}>
      {!hasnextpage && <span style={{margin:"10px auto",padding:"10px",borderRadius:"0.5rem", backgroundColor:"#202020"}}>
        End of the page
        </span>}
      </div>
        </>
  );
}

export default Trending;
