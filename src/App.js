import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import './App.css';
import HolyQuran from './HolyQuran';
import Surah from './Surah';
import { EditionProvider } from './EditionContext';
import Welcome from './Welcome';

function App() {
  return (
  <EditionProvider>
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/quran-ui" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quran" element={<HolyQuran />} />
          <Route path="/surah" element={<Surah />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  </EditionProvider>
  );
}

export default App;
