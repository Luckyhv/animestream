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

  const setGlobalData = (newData) => {
    setData(newData);
  };

  const anifyGlobalData = (epdata) =>{
    setAnifyData(epdata);
  } 

  useEffect(() => {
    localStorage.setItem('animedetails', JSON.stringify(data));
    localStorage.setItem('anifyEpisodes', JSON.stringify(anifyData));
    const anifyimage = async()=>{
      const response = await axios.get(`https://api.anify.tv/info/${data.id}?fields=[bannerImage]`)
      setanifybanner(response.data.bannerImage);
    }
    anifyimage();
  }, [data, anifyData]);

  return (
    <DataContext.Provider value={{ data, setGlobalData, isopen, setisopen, anifyGlobalData, anifyData, anifybanner }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
