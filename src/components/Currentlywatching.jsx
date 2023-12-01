import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDraggable } from 'react-use-draggable-scroll';
import CurrentWatchingSkeleton from '../skeletons/CurrentWatchingSkeleton';
import '../styles/Currentlywatching.css'

function Currentlywatching() {
  const [data, setData] = useState(null);
  const ref = useRef();
  const { events } = useDraggable(ref);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem('artplayer_settings'));
      if (data) {
        const arr = Object.keys(data).map((key) => data[key]);
        setData(arr);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  function removeid(id){
      console.log("remove");
    if (id) {
      // remove from local storage
      const artplayerSettings =
        JSON.parse(localStorage.getItem('artplayer_settings')) || {};
      if (artplayerSettings[id]) {
        delete artplayerSettings[id];
        localStorage.setItem(
          'artplayer_settings',
          JSON.stringify(artplayerSettings)
        );
        // Assuming you also want to update the state after removing the item
        setData((prevData) => prevData.filter((item) => item.id !== id));
      }
      const currentData =
      JSON.parse(localStorage.getItem("artplayer_settings")) || {};

    // Create a new object to store the updated data
    const updatedData = {};

    // Iterate through the current data and copy items with different aniId to the updated object
    for (const key in currentData) {
      const item = currentData[key];
      if (item.id !== id) {
        updatedData[key] = item;
      }
    }

    // Update localStorage with the filtered data
    localStorage.setItem("artplayer_settings", JSON.stringify(updatedData));
    }
  };

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    const formattedTime = `${formattedMinutes}:${formattedSeconds}`;
    return formattedTime;
  }

  if (Loading) {
    return (
      <div className="" ref={ref} {...events}>
        <CurrentWatchingSkeleton />
      </div>
    );
  }
  
  if(data.length<2){
    return(
        <div ref={ref} {...events}></div>
    )
  }

  return (
    <div className='cwcontainer'>
      <p className='hometitle'>
        <span>C</span>ontinue Watching
      </p>
      <div className='cwitems' {...events} ref={ref}>
        {data
          ?.filter((i) => i?.id)
          .map((i) => (
            <React.Fragment key={i.id}>
       <div className='currentwatching'>
     <button className="currentremove" onClick={()=>removeid(i.id)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width={17}
          height={17}
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>    
      <Link
                  className='anime-link'
                  to={`/watch/${i.id}/${i.provider}/${encodeURIComponent(
                    i.epid
                  )}/${i.episode}/${i.subtype}`}
                >         
                  <div className='currentwatchimgcon'>
                    <span className=''>
                      <img
                        src={i.image}
                        className='currentwatch-image'
                        alt='Anime Episode'
                      />
                    </span>
                    <div className='history-layer'></div>
                  </div>
                 
                  <div className='currentwatchanime-details'>
                    <div className='anime-info'>
                      <div className='title-container'>
                        <span className='anime-title'>{i.aniTitle}</span>
                        <span className='anime-subtitle'>
                          {formatTime(i.timeWatched)} /{' '}
                          {formatTime(i.duration)} - Episode {i.episode}
                        </span>
                      </div>
                      <div className='play-button-container'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width={22}
                          height={22}
                          viewBox='0 0 24 24'
                          fill='white'
                          aria-hidden='true'
                          className='w-5 h-5 shrink-0'
                        >
                          <path
                            fill-rule='evenodd'
                            d='M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z'
                            clip-rule='evenodd'
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className='progress'>
                      <hr
                        className='progressline'
                        style={{ width: `${(i.timeWatched / i.duration) * 100}%` }}
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}
export default Currentlywatching;
