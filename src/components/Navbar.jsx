import React, { useContext, useEffect } from 'react';
import '../styles/Navbar.css';
import Search from './Search';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

function Navbar() {
  const { isopen,setisopen } = useContext(DataContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyS' && e.ctrlKey) {
        e.preventDefault();
        setisopen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setisopen]);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link className="link" to={`/`}>
            <span>A</span>nistream
          </Link>
        </div>
      </div>
      <div className="navbar-right">
        <button onClick={() => setisopen(true)} className="search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
        {isopen && <Search />}
      </div>
    </div>
  );
}

export default Navbar;
