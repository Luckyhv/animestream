import React, { useContext } from 'react';
import '../styles/Animeplayer.css';
import PlayerComponent from '../art-player/PlayerComponent';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import Episodelist from '../components/Episodelist';
import '../styles/Animeplayer.css'

function Animeplayer() {
  const { id, epid, epnum, provider, subtype } = useParams();
  const { data } = useContext(DataContext);
  const navigate = useNavigate();

  // Find the index of the current episode in the data.episodes array
  const currentEpisodeIndex = data.episodes.findIndex((episode) => episode.number === parseInt(epnum, 10));

  // Function to handle navigation to the next episode
  const handleNextEpisode = () => {
    const nextEpisodeIndex = currentEpisodeIndex + 1;
    if (nextEpisodeIndex < data.episodes.length) {
      const nextEpisodeNumber = data.episodes[nextEpisodeIndex].number;
      const nextepisodeid = data.episodes[nextEpisodeIndex].id;
      navigate(`/watch/${id}/${provider}/${encodeURIComponent(nextepisodeid)}/${nextEpisodeNumber}/${subtype}`);
    }
  };

  // Function to handle navigation to the previous episode
  const handlePreviousEpisode = () => {
    const previousEpisodeIndex = currentEpisodeIndex - 1;
    if (previousEpisodeIndex >= 0) {
      const previousEpisodeNumber = data.episodes[previousEpisodeIndex].number;
      const previousepisodeid = data.episodes[previousEpisodeIndex].id;
      navigate(`/watch/${id}/${provider}/${encodeURIComponent(previousepisodeid)}/${previousEpisodeNumber}/${subtype}`);

    }
  };

  return (
    <div>
      <div className="player">
        <div className="playerstyle">
        <PlayerComponent epid={epid} epnum={epnum} provider={provider} subtype={subtype}/>
        <div className="episode-navigation-buttons">
        <div className="playerinfo">
        <h2 className='watchtitle'>{data.title.english}</h2>  <h4 className='episodenum'>Episode-{epnum}</h4>
        </div>
        <div className="btnsorder">
        <button onClick={handlePreviousEpisode} className='playerbtns' disabled={currentEpisodeIndex === 0}>Previous</button>
          <button onClick={handleNextEpisode} className='playerbtns' disabled={currentEpisodeIndex === data.episodes.length - 1}>Next</button>
        </div>
        </div>
      <Episodelist epnumber={epnum}/>
        </div>
      </div>
    </div>
  );
}

export default Animeplayer;
