import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
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
        <Router basename="/">
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/home" element={<Home />} />
                <Route path="/quran" element={<HolyQuran />} />
                <Route path="/surah" element={<Surah />} />
                <Route path="/read" element={<QuranReader />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BismillahProvider>
    </EditionProvider>
  );
}

export default App;
