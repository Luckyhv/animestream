import React, { useContext, useEffect, useState } from 'react';
import '../styles/Animeplayer.css';
import PlayerComponent from '../art-player/PlayerComponent';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Episodelist from '../components/Episodelist';
import '../styles/Animeplayer.css'
import Animedetailsskeleton from '../skeletons/Animedetailsskeleton';

function Animeplayer() {
  const { id, epid, epnum, provider, subtype } = useParams();
  const { data,anifyData, fetchAnimeDetails, fetchAnifyEpisodes } = useContext(DataContext);
  const navigate = useNavigate();
  const [nexttrack,setnexttrack] = useState({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentProvider = anifyData.find(providerData => providerData.providerId === provider);
  const currentEpisodeIndex = currentProvider.episodes.findIndex(
    episode => episode.number === parseInt(epnum, 10)
  );

  useEffect(()=>{
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id !== data?.id) {
          await fetchAnimeDetails(id);
          await fetchAnifyEpisodes(id);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Error fetching data');
        setLoading(false);
      }
    };

    fetchData();

    const nextEpisodeIndex = currentEpisodeIndex + 1;
    if (nextEpisodeIndex < currentProvider.episodes.length) {
      const nextEpisodeNumber = currentProvider.episodes[nextEpisodeIndex].number;
      const nextepisodeid = currentProvider.episodes[nextEpisodeIndex].id;
      setnexttrack({
        nextepisodeid:nextepisodeid,
        nextEpisodeNumber:nextEpisodeNumber
      })
    }
    else{
      setnexttrack({
        nextepisodeid:null,
        nextEpisodeNumber:null
      })
    }
  },[id, data, fetchAnimeDetails, fetchAnifyEpisodes, epnum, epid, provider, anifyData])

  const handleNextEpisode = () => {
    const nextEpisodeIndex = currentEpisodeIndex + 1;
    if (nextEpisodeIndex < currentProvider.episodes.length) {
      const nextEpisodeNumber = currentProvider.episodes[nextEpisodeIndex].number;
      const nextepisodeid = currentProvider.episodes[nextEpisodeIndex].id;
      navigate(`/watch/${id}/${provider}/${encodeURIComponent(nextepisodeid)}/${nextEpisodeNumber}/${subtype}`);
    }
  };


  // Function to handle navigation to the previous episode
  const handlePreviousEpisode = () => {
    const previousEpisodeIndex = currentEpisodeIndex - 1;
    if (previousEpisodeIndex >= 0) {
      const previousEpisodeNumber = currentProvider.episodes[previousEpisodeIndex].number;
      const previousepisodeid = currentProvider.episodes[previousEpisodeIndex].id;
      navigate(`/watch/${id}/${provider}/${encodeURIComponent(previousepisodeid)}/${previousEpisodeNumber}/${subtype}`);
    }
  };

  if (loading) {
    return <Animedetailsskeleton/> ;
  }

  if (error) {
    // Display an error message
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="player">
        <div className="playerstyle">
        <PlayerComponent epid={epid} epnum={epnum} provider={provider} subtype={subtype} nexttrack={nexttrack} eptitle={currentProvider.episodes[currentEpisodeIndex].title}/>
        <div className="episode-navigation-buttons">
        <div className="playerinfo">
        <h2 className='watchtitle'>{data.title.english} (<span style={{textTransform:"capitalize"}}>{subtype}</span>)</h2> 
        <h4 className='episodenum'>{ currentProvider.episodes[currentEpisodeIndex].title || ""}</h4>
        </div>
        <div className="btnsorder">
        <button onClick={handlePreviousEpisode} className='playerbtns' disabled={currentEpisodeIndex === 0}>Previous</button>
          <button onClick={handleNextEpisode} className='playerbtns' disabled={currentEpisodeIndex === currentProvider.episodes.length - 1}>Next</button>
        </div>
        </div>
        <div className="eplist">
      <Episodelist epnumber={epnum}/>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Animeplayer;
