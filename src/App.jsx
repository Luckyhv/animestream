// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import Animedetails from './pages/Animedetails';
// import TrendingPage from './pages/TrendingPage';
// import PopularPage from './pages/PopularPage';
import Animeplayer from './pages/Animeplayer';
import {  DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';

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
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/info/:id" element={<Animedetails/>} />
        <Route path="/watch/:id/:provider/:epid/:epnum/:subtype" element={<Animeplayer/>} /> 
        {/* <Route path="/trending" component={TrendingPage} />
        <Route path="/popular" component={PopularPage} />
      */}
      <Route path="*" element={<UnderDevelopment />} />
      </Routes>
    </Router>
      </DataProvider>
  );
};

export default App;
