import { createContext, useState, useEffect } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const storedData = localStorage.getItem('animedetails');
  const anifystored = localStorage.getItem('anifyEpisodes')
  const [data, setData] = useState(storedData ? JSON.parse(storedData) : null);
  const [isopen, setisopen] = useState(false);
  const [anifyData, setAnifyData] = useState(anifystored ? JSON.parse(anifystored) : null);

  const setGlobalData = (newData) => {
    setData(newData);
  };

  const anifyGlobalData = (epdata) =>{
    setAnifyData(epdata);
  } 

  useEffect(() => {
    localStorage.setItem('animedetails', JSON.stringify(data));
    localStorage.setItem('anifyEpisodes', JSON.stringify(anifyData));
  }, [data, anifyData]);

  return (
    <DataContext.Provider value={{ data, setGlobalData, isopen, setisopen, anifyGlobalData, anifyData }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
