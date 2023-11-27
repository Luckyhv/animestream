import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Animedetailsskeleton from "../skeletons/Animedetailsskeleton";
import useWindowDimensions from "../utils/Windowdimensions";
import '../styles/Animedetails.css'
import { DataContext } from '../context/DataContext';

function Animedetails() {
  const { id } = useParams();
  const { setGlobalData, anifyGlobalData } = useContext(DataContext)
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const [localStorageDetails, setLocalStorageDetails] = useState(0);
  const defaultProvider = 'gogoanime';
  const subtype = 'sub';

  const fetchData = async () => {
    setExpanded(false);
    window.scrollTo(0, 0);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}meta/anilist/info/${id}`,{
          params:{
            provider: 'gogoanime'
          }
        }
        // `https://api.anify.tv/info/${id}?fields=[id,slug,coverImage,bannerImage,trailer,status,season,title,currentEpisode,countryOfOrigin,description,duration,color,year,type,format,totalEpisodes,totalChapters,genres,averageRating,averagePopularity,relationType]`
      );
        setAnimeDetails(response.data);
        setGlobalData(response.data);
        getLocalStorage(response.data);
    } catch (error) {
      console.error("Error fetching anime details:", error);
    } finally {
      setLoading(false);
    }
  };

  const anifydata = async () => {
    try {
      const res = await axios.get(`https://api.anify.tv/episodes/${id}`);

      anifyGlobalData(res.data)
    } catch (error) {
      console.error("Error fetching anify data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    anifydata();
  }, [id]);

  function readMoreHandler() {
    setExpanded(!expanded);
  }

  function getLocalStorage(animeDetails) {
    if (localStorage.getItem("Anime")) {
      let cachedata = localStorage.getItem("Anime");
      cachedata = JSON.parse(cachedata);

      let index = cachedata.Names.findIndex(
        (i) => i.name === animeDetails.title.english
      );

      if (index !== -1) {
        setLocalStorageDetails(cachedata.Names[index].currentEpisode);
      }
    }
  }

  if (loading) {
    return <Animedetailsskeleton/> ;
  }

  return (
    <div>
        <div className="detailscontent">
          {!loading && animeDetails && (
            <div>
              <img className="detailsbannerimg"
                src={
                 animeDetails.cover
                    ? animeDetails.cover
                    : "https://cdn.wallpapersafari.com/41/44/6Q9Nwh.jpg"
                }
                alt=""
              />
              <div className="detailscontentwrapper">
                <div className="detailsposter">
                  <img src={animeDetails.image} alt="" />
                  {localStorageDetails !== 0 &&
                  animeDetails.episodes &&
                  animeDetails.episodes.length > 0 ? (
                    <Link to={"/watch/" + animeDetails.episodes[0]?.id} className="detailsbtn">
                      EP - {localStorageDetails}
                    </Link>
                  ) : (
                    <Link to={`/watch/${id}/${defaultProvider}/${animeDetails.episodes[0]?.id}/${animeDetails.episodes[0]?.number}/${subtype}`} className="detailsbtn">
                      Watch Now
                    </Link>
                  )}
                </div>
                <div>
                  <h1>{animeDetails.title.english?animeDetails.title.english:animeDetails.title.romaji}</h1>
                  <p>
                    <span>Other Name: </span>
                    {animeDetails.title.romaji?animeDetails.title.romaji:animeDetails.title.native}
                  </p>
                  <p>
                    <span>Type: </span>
                    {animeDetails.type}
                  </p>
                  {width <= 1100 && expanded && (
                    <p>
                      <span>Description: </span>
                      <p style={{display:"inline"}} dangerouslySetInnerHTML={{ __html: animeDetails.description }}></p>
                      <button onClick={() => readMoreHandler()}>
                        read less
                      </button>
                    </p>
                  )}
                  {width <= 1100 && !expanded && (
                    <p>
                      <span>Description: </span>
                      <p style={{display:"inline"}} dangerouslySetInnerHTML={{ __html: animeDetails.description
                        .replace("Description:", "")
                        .substring(0, 200) + "... " }}></p>
                      <button onClick={() => readMoreHandler()}>
                        read more
                      </button>
                    </p>
                  )}
                  {width > 1100 && (
                    <p>
                      <span>Description: </span>
                      <p style={{display:"inline"}} dangerouslySetInnerHTML={{ __html: animeDetails.description }}></p>
                    </p>
                  )}

                  <p>
                    <span>Genre: </span>
                    {animeDetails.genres.join(", ")}
                  </p>
                  <p>
                    <span>Rating: </span>
                    {animeDetails.rating/10}
                  </p>
                  <p>
                    <span>Status: </span>
                    {animeDetails.status}
                  </p>
                  <p>
                    <span>Duration: </span>
                    {animeDetails.duration}min
                  </p>
                  <p>
                    <span>Current Episode: </span>
                    {animeDetails.currentEpisode && animeDetails.currentEpisode}
                  </p>
                  <p>
                    <span>Total Episodes: </span>
                    {animeDetails.totalEpisodes}
                  </p>
                </div>
              </div>
              </div>
          )}
        </div>
    </div>
  );
}

export default Animedetails;