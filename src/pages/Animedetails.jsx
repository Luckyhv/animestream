import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Animedetailsskeleton from "../skeletons/Animedetailsskeleton";
import useWindowDimensions from "../utils/Windowdimensions";
import '../styles/Animedetails.css'
import { DataContext } from '../context/DataContext';
import Skeleton from "react-loading-skeleton";

function Animedetails() {
  const { id } = useParams();
  const { fetchAnifyEpisodes, fetchAnimeDetails } = useContext(DataContext)
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const [localStorageDetails, setLocalStorageDetails] = useState(0);
  const [anifyepisodes, setanifyepisodes] = useState([]);
  const [aniloading, setaniloading] = useState(true);
  const subtype = 'sub';

  const fetchData = async () => {
    setExpanded(false);
    window.scrollTo(0, 0);
    try {
      const fetchedData = await fetchAnimeDetails(id);
      setAnimeDetails(fetchedData);
      getLocalStorage(fetchData);
    } catch (error) {
      console.error("Error fetching anime details:", error);
    } finally {
      setLoading(false);
    }  };

  const anifydata = async () => {
    try {
      const fetchedepisodes = await fetchAnifyEpisodes(id);
      // const res = await axios.get(`https://api.anify.tv/info/${id}?fields=[episodes]`);
      const gogoAnimeEpisode = fetchedepisodes.find(item => item.providerId === 'gogoanime');

      if (gogoAnimeEpisode) {
        // Do something with the found episode
        console.log("Found gogoanime episode:", gogoAnimeEpisode);
        setanifyepisodes(gogoAnimeEpisode)
      } else {
        console.log("No gogoanime episode found");
        setanifyepisodes(fetchedepisodes[0])
      }
    } catch (error) {
      console.error("Error fetching anify data:", error);
    } finally {
      setaniloading(false);
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
    return <Animedetailsskeleton />;
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
                <img src={animeDetails.image || animeDetails.coverImage} alt="" />
                {aniloading && (
                  <div style={{position:"relative",top:"-25%",width:"100%",margin:"7px 0"}}
                  > <Skeleton
                    width={"100%"}
                    height={"50px"}
                    baseColor={"#202020"}
                    highlightColor={"#333a"}
                    /> </div>
                )}
                {!aniloading && (
                  <>
                    {localStorageDetails !== 0 && anifyepisodes?.episodes && anifyepisodes?.episodes.length > 0 ? (
                      <Link to={`/watch/${anifyepisodes.episodes[0].id}`} className="detailsbtn">
                        EP - {localStorageDetails}
                      </Link>
                    ) : (
                      anifyepisodes?.episodes && (
                        <Link to={`/watch/${id}/${anifyepisodes.providerId}/${encodeURIComponent(anifyepisodes.episodes[0].id)}/${anifyepisodes.episodes[0].number}/${subtype}`} className="detailsbtn">
                          Watch Now
                        </Link>
                      )
                      )}
                  </>
                )}
              </div>
              <div>
                <h1>{animeDetails.title.english || animeDetails.title.romaji}</h1>
                <p>
                  <span>Other Name: </span>
                  {animeDetails.title.romaji ? animeDetails.title.romaji : animeDetails.title.native}
                </p>
                <p>
                  <span>Type: </span>
                  {animeDetails.format || animeDetails.type}
                </p>
                {width <= 1100 && expanded && (
                  <p>
                    <span>Description: </span>
                    <p style={{ display: "inline" }} dangerouslySetInnerHTML={{ __html: animeDetails.description }}></p>
                    <button onClick={() => readMoreHandler()}>
                      read less
                    </button>
                  </p>
                )}
                {width <= 1100 && !expanded && (
                  <p>
                    <span>Description: </span>
                    <p style={{ display: "inline" }} dangerouslySetInnerHTML={{
                      __html: animeDetails.description
                        .replace("Description:", "")
                        .substring(0, 200) + "... "
                    }}></p>
                    <button onClick={() => readMoreHandler()}>
                      read more
                    </button>
                  </p>
                )}
                {width > 1100 && (
                  <p>
                    <span>Description: </span>
                    <p style={{ display: "inline" }} dangerouslySetInnerHTML={{ __html: animeDetails.description }}></p>
                  </p>
                )}

                <p>
                  <span>Genre: </span>
                  {animeDetails.genres.join(", ")}
                </p>
                <p>
                  <span>Rating: </span>
                  {animeDetails.rating / 10 || animeDetails.averageRating}
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