// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import Animedetails from './pages/Animedetails';
import Recentepisodes from './pages/Recentepisodes';
import Popular from './pages/Popular';
import Animeplayer from './pages/Animeplayer';
import {  DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Trending from './pages/Trending';

const UnderDevelopment = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>Page Under Development</h2>
  </div>
);

const App = () => {
  return (
    <DataProvider>
    <Router>
      <Navbar/>
      <div className='allcomponents'>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/info/:id" element={<Animedetails/>} />
        <Route path="/watch/:id/:provider/:epid/:epnum/:subtype" element={<Animeplayer/>} /> 
        <Route path="/trending" element={<Trending/> } />
        <Route path="/popular" element={<Popular/> }/>
        <Route path="/recent-episodes" element={<Recentepisodes/> }/>
      <Route path="*" element={<UnderDevelopment />} />
      </Routes>
      </div>
    </Router>
      </DataProvider>
  );
};

export default App;
