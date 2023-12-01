import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
const DataContext = createContext();

const DataProvider = ({ children }) => {
  const storedData = localStorage.getItem('animedetails');
  const anifystored = localStorage.getItem('anifyEpisodes')
  const [data, setData] = useState(storedData ? JSON.parse(storedData) : null);
  const [isopen, setisopen] = useState(false);
  const [anifyData, setAnifyData] = useState(anifystored ? JSON.parse(anifystored) : null);
  const [anifybanner,setanifybanner] = useState("")
  const [playerState, setPlayerState] = useState({
    currentTime: 0,
    isPlaying: false,
  });

  const setGlobalData = (newData) => {
    setData(newData);
  };

  const anifyGlobalData = (epdata) =>{
    setAnifyData(epdata);
  } 

    const fetchAnimeDetails = async (id) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}meta/anilist/info/${id}`,
          {
            params: {
              provider: 'animefox',
            },
          }
        // `https://api.anify.tv/info/${id}?fields=[id,slug,coverImage,bannerImage,trailer,status,season,title,currentEpisode,countryOfOrigin,description,duration,year,type,format,totalEpisodes,genres,averageRating]`
        );
        setGlobalData(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching anime details:", error);
        return null; // or handle the error as needed
      }
    };
    
    const fetchAnifyEpisodes=async(id)=>{
      try {
        const res = await axios.get(`https://api.anify.tv/episodes/${id}`);
        // const res = await axios.get(`https://api.anify.tv/info/${id}?fields=[episodes]`);
        anifyGlobalData(res.data);
        return res.data;
      } catch (error) {
        console.error("Error fetching anify data:", error);
      } 
    }

  useEffect(() => {
    localStorage.setItem('animedetails', JSON.stringify(data));
    localStorage.setItem('anifyEpisodes', JSON.stringify(anifyData));
    const anifyimage = async()=>{
      const response = await axios.get(`https://api.anify.tv/info/${data.id}?fields=[bannerImage]`)
      setanifybanner(response.data.bannerImage);
    }
    anifyimage();
  }, [data, anifyData,fetchAnimeDetails,fetchAnifyEpisodes]);

  return (
    <DataContext.Provider value={{ data, setGlobalData, isopen, setisopen, anifyGlobalData, anifyData, anifybanner,   playerState,
      setPlayerState, fetchAnimeDetails, fetchAnifyEpisodes }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
