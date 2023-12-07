import React, { useEffect, useState } from 'react';
import { topalltime,seasonal } from '../Anilistquery';
import "../styles/Verticalcard.css";
import { Link } from 'react-router-dom';
import Verticalcardskeleton from '../skeletons/Verticalcardskeleton';

const Verticalcard = ({activeButton}) => {
    const [topAnime, setTopAnime] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopAnime = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        query: activeButton==="seasonal"?seasonal:topalltime,
                        variables: {
                            page: 1,
                            perPage: 10,
                        },
                    }),
                });

                const data = await response.json();
                setTopAnime(data.data.Page.media);
                setLoading(false);
                console.log(data.data.Page.media);
            } catch (error) {
                console.error('Error fetching data from AniList:', error);
                setLoading(false);
            }
        };

        fetchTopAnime();
    }, [activeButton]);

    const convertMinutesToHoursAndMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} hour, ${remainingMinutes} mins`;
    };

    const getColorStyle = (coverColor) => {
        const maxWidth = window.innerWidth;
        return maxWidth <= 900
          ? { backgroundColor: coverColor, color: 'black' }
          : { backgroundColor: 'transparent', color: coverColor };
      };

    return (
        <div className='verticalcard'>
            {loading ? (
                <Verticalcardskeleton/>
                ) : (
                topAnime.map((anime, index) => (
                    <div className="vcarditem" key={anime.id}>
                        <div className="vcardindex" style={index < 3 ? getColorStyle(anime.coverImage.color) : {}}>#{index + 1}</div>
                        <div className="vcardcontent">
                            <div className="vcardleft">
                                <img src={anime.coverImage.large} alt="" className='vcardimg' />
                                <div className="vcardinfo">
                                    <Link to={`/info/${anime.id}`} className='linktitle' onMouseOver={(e) => e.target.style.color = `${anime.coverImage.color}`}
                                        onMouseOut={(e) => e.target.style.color = 'white'}>{anime.title.english || anime.title.romaji}</Link>
                                    <div className="vcardgenres">
                                        {anime.genres.map((genre) => (
                                            <div key={genre} className="vgenre" style={{ backgroundColor: `${anime.coverImage.color}` }}>{genre}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="vcardright">
                                <div className="vcardpopular">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>
                                    <div className="vpopular p">
                                    <span className='score'>{anime.averageScore ? `${anime.averageScore}%` : 'NA'}</span>
                                        <span className='bpopular'>{anime.popularity} users</span>
                                    </div>
                                </div>
                                <div className="vpopular f">
                                    <span className='format'> {anime.format === "TV" ? anime.format + " Show" : anime.format} </span>
                                    <div className="vcardformat">
                                        {anime.episodes === 1 ? (
                                            <span className='bpopular'>{convertMinutesToHoursAndMinutes(anime.duration) || Na}</span>
                                        ) : (
                                            <span className='bpopular'>{anime.episodes ? `${anime.episodes} episodes` : 'Unknown'} </span>
                                        )}
                                    </div>
                                </div>
                                <div className="vcardstatus s">
                                    <div className="season">
                                        {anime.season} {anime.seasonYear}
                                    </div>
                                    <div className={`${anime.status === 'RELEASING' ? "vstatus c" : "vstatus"}`}>
                                        {anime.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Verticalcard;
