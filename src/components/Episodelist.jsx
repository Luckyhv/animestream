import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { Link, useParams } from 'react-router-dom';
import '../styles/Episodelist.css';

function Episodelist() {
  const { epnum,provider } = useParams();
  const { data, anifyData } = useContext(DataContext);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [providers, setProviders] = useState([]);
  const [subtype, setSubtype] = useState('sub');

  const toggleSubtype = () => {
    setSubtype(subtype === 'sub' ? 'dub' : 'sub');
  };

  useEffect(() => {
    if (anifyData?.length > 0) {
      const providerIds = [...anifyData.map(provider => provider.providerId)];
      setProviders(providerIds);
      const initialProvider = providerIds.includes(provider) ? provider : providerIds[0];
      setSelectedProvider(initialProvider);
    }
  }, [anifyData, provider]);

  const handleChangeProvider = (event) => {
    setSelectedProvider(event.target.value);
  };


  const getProvidersWithDub = () => {
    return anifyData
      .filter(provider => provider.episodes.some(episode => episode.hasDub))
      .map(provider => provider.providerId);
  };

  const getEpisodesByProvider = () => {
      const selectedProviderData = anifyData.find(provider => provider.providerId === selectedProvider);
      return selectedProviderData ? selectedProviderData.episodes : [];
  };

  const episodes = getEpisodesByProvider();
  const availableProviders = subtype === 'dub' ? getProvidersWithDub() : providers;

  return (
    <div>
      {/* <label>
        <input
          placeholder='Find Number'
          type="number"
          className='searchnumber'
        />
      </label> */}

      <div className='providersubtype'>
        <button onClick={toggleSubtype} className='togglesub'>
          {subtype === 'sub' ? 'Sub' : 'Dub'}
        </button>
        <label>
          <select value={selectedProvider} onChange={handleChangeProvider} className='episoderange'>
            {availableProviders.map(provider => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </label>
      </div>


      <div className="episodes">
        <ul>
          {episodes.map((episode) => (
            <li key={episode.number}>
              <Link
                to={`/watch/${data.id}/${selectedProvider}/${encodeURIComponent(episode.id)}/${episode.number}/${subtype}`}
                className={`episodelink ${
                  String(episode.number) === String(epnum)
                    ? 'selected-episode'
                    : 'notselectedep'
                }`}
              >
                {episode.number}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Episodelist;
