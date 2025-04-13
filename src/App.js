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
import QuranReader from './components/QuranReader';
import { BismillahProvider } from './context/BimillahContext';

function App() {
  return (
  <EditionProvider>
    <BismillahProvider>
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/quran-ui" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quran" element={<HolyQuran />} />
          <Route path="/surah" element={<Surah />} />
          <Route path="/read" element={<QuranReader />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </BismillahProvider>
  </EditionProvider>
  );
}

export default App;
