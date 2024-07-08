import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import EditionContext from './EditionContext';
import './App.css';

const Surah = () => {
  const location = useLocation();
  const { item, surahList } = location.state || { item: {}, surahList: [] };
  const [ayahList, setAyahList] = useState([]);
  const [edition, setEdition] = useState([]);
  const [translatedEdition, setTranslatedEdition] = useState([]);
  const [translatedAyahList, setTranslatedAyahList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(item);
  const [loading, setLoading] = useState(false);
  const { textContext, translationContext } = useContext(EditionContext);

  useEffect(() => {
    if (item && item.number && textContext && translationContext) {
      fetchSurahData(item.number);
    }
  }, [item, textContext, translationContext]);

  const fetchSurahData = (number) => {
    setLoading(true);
    console.log('textContext', textContext);
    console.log('translationContext', translationContext);
    axios.get(`https://api.alquran.cloud/v1/surah/${number}/editions/${textContext.identifier},${translationContext.identifier}`)
      .then(response => {
        const ayahList = response.data.data[0].ayahs;
        setEdition(response.data.data[0].edition);
        const translatedList = response.data.data[1].ayahs;
        setAyahList(ayahList);
        setTranslatedAyahList(translatedList);
        setTranslatedEdition(response.data.data[1].edition);
      })
      .catch(error => {
        console.error('There was an error!', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectionChange = (event) => {
    const itemNumber = event.target.value;
    const selected = surahList.find(surah => surah.number.toString() === itemNumber);
    setSelectedItem(selected);
    fetchSurahData(itemNumber);
  };

  return (
    <div className='surah'>
      <div className="dropdown-container">
        <select onChange={handleSelectionChange} value={selectedItem ? selectedItem.number : ''}>
          <option value="" disabled>Select a Surah</option>
          {surahList.map((surah, index) => (
            <option key={index} value={surah.number}>{surah.number} - {surah.englishName}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Surah #: {selectedItem.number}</h2>
          <h1 style={{ textAlign: 'center' }}>{selectedItem.name} ({selectedItem.englishName})</h1>
          {ayahList.map((ayah, index) => (
            <div key={index}>
              
              <p style={{ textAlign: edition.direction === 'rtl' ? 'right' : 'left', fontSize: '2em' }}>{ayah.text}

              <span data-font-scale="3" data-font="code_v1" className="glyph-word"> ({ayah.numberInSurah})</span>
              </p>
              <p style={{ textAlign: translatedEdition[index]?.direction === 'rtl' ? 'right' : 'left' }}>{index + 1}. {translatedAyahList[index]?.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Surah;
