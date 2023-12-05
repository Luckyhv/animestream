import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/Trending.css'

function Viewallcard({anime}) {
  return (
      <div key={anime.id} className="viewitem">
        <Link to={`/info/${anime.id}`}>
          <img src={anime.image} alt={anime.title.english} className='animecardimg' />
        </Link>
        <div className="animecard-content">
          <p className='viewcardtitle'>
            {anime.title.english
              ? anime.title.english
              : anime.title.romaji}
          </p>
        </div>
      </div>
  )
}

export default Viewallcard
