import React, { useState, useEffect, useRef, useContext } from 'react';
import EditionContext from '../EditionContext';
import BismillahContext from '../context/BimillahContext';
import './QuranReader.css';
import '../css/font-kitab.css';
import axios from 'axios';

const QuranReader = () => {
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayas, setAyas] = useState([]);
  const [suraName, setSuraName] = useState('');
  const [juzName, setJuzName] = useState('');
  const middleFrameRef = useRef(null);
  const { textContext, translationContext } = useContext(EditionContext);
  const { bismillahAyah, loading } = useContext(BismillahContext);

  const fetchAyas = async (surahNumber) => {
    try {
      const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${textContext.identifier}`);
      const surahData = response.data.data[0];
      console.log(surahData);
      setAyas(surahData.ayahs);
      setSuraName(surahData.englishName);
      setJuzName(`Juz ${surahData.ayahs[0].juz}`);
    } catch (error) {
      console.error('Error fetching ayas:', error);
    }
  };

  useEffect(() => {
    fetchAyas(surahNumber);
  }, [surahNumber, textContext, translationContext]);

  useEffect(() => {
    if (middleFrameRef.current) {
      middleFrameRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [ayas]);

  const changeSurah = (direction) => {
    if (direction === 'left' && surahNumber > 1) {
      setSurahNumber(surahNumber - 1);
    } else if (direction === 'right' && surahNumber < 114) {
      setSurahNumber(surahNumber + 1);
    }
  };

  return (
    <div id="quran-tab" className="quran quran-tab trans-tab" data="bn.bengali.3">
      <div className="quranPageHeader ui-helper-clearfix">
        <div style={{ float: 'left', width: '35%', textAlign: 'left' }}>
          <span className="suraName">{suraName}</span>
        </div>
        <div style={{ float: 'left', width: '30%', textAlign: 'center' }}>
          <a className="arrow-link arrow-left" href="javascript:void(0)" onClick={() => changeSurah('left')}>◄</a>
          &nbsp;
          <select
            value={surahNumber}
            onChange={(e) => setSurahNumber(Number(e.target.value))}
          >
            {Array.from({ length: 114 }, (_, i) => i + 1).map((number) => (
              <option key={number} value={number}>{number}</option>
            ))}
          </select>
          &nbsp;
          <a className="arrow-link arrow-right" href="javascript:void(0)" onClick={() => changeSurah('right')}>►</a>
        </div>
        <div style={{ float: 'right', width: '35%', textAlign: 'right' }}>
          <span className="juzName">{juzName}</span>
        </div>
      </div>

      <div className="qFrame qFrameTop"></div>

      <div className="qFrame qFrameMiddle" id="middleFrame" ref={middleFrameRef}>
        <div className="quranText transText font-kitab" id="quranText">
        {!loading && bismillahAyah && surahNumber !== 1 && surahNumber !== 9 && (
            <div className="ayah-container" style={{ textAlign: 'center' }}>
              <span className="ayah">
                {bismillahAyah}
              </span>
              <div className="ayah-separator"></div>
            </div>
          )}
          {ayas.map(ayah => (
            <div key={ayah.number} className="ayah-container" style={{ textAlign: textContext.direction === 'rtl' ? 'right' : 'left' }}>
              <span className="ayah">
                {ayah.text}
                <span data-font-scale="3" data-font="code_v1" className="glyph-word"> ({ayah.numberInSurah})</span>
              </span>
              <div className="ayah-separator"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="qFrame qFrameBottom"></div>

      <div className="quranPageFooter">
        <a className="arrow-link arrow-left" href="javascript:void(0)" onClick={() => changeSurah('left')}>◄</a>
        &nbsp;
        <select
          value={surahNumber}
          onChange={(e) => setSurahNumber(Number(e.target.value))}
        >
          {Array.from({ length: 114 }, (_, i) => i + 1).map((number) => (
            <option key={number} value={number}>{number}</option>
          ))}
        </select>
        &nbsp;
        <a className="arrow-link arrow-right" href="javascript:void(0)" onClick={() => changeSurah('right')}>►</a>
      </div>
    </div>
  );
};

export default QuranReader;
