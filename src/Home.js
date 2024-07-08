import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Welcome from './Welcome';
import EditionContext from './EditionContext';

function Home() {
  const [editions, setEditions] = useState([]);
  const { textContext, setTextContext, translationContext, setTranslationContext } = useContext(EditionContext);

  useEffect(() => {
    axios.get('https://api.alquran.cloud/v1/edition')
      .then(response => {
        setEditions(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching the editions!', error);
      });
  }, []);

  const handleTextContextChange = (event) => {
    const selectedTextContext = editions.find(edition => edition.identifier === event.target.value);
    console.log('handleTextContextChange', selectedTextContext);
    setTextContext(selectedTextContext);
  };

  const handleTranslationContextChange = (event) => {
    const selectedTranslationContext = editions.find(edition => edition.identifier === event.target.value);
    console.log('handleTranslationContextChange', selectedTranslationContext);
    setTranslationContext(selectedTranslationContext);
  };

  return (
    <div className="App">
      <h1>Welcome to our app</h1>
      <div>
        <label htmlFor="text-context-select">Choose a text edition:</label>
        <select id="text-context-select" onChange={handleTextContextChange} value={textContext?.identifier || ''}>
          <option value="" disabled>Select a text edition</option>
          {editions.map((edition) => (
            <option key={edition.identifier} value={edition.identifier}>
              {edition.englishName} ({edition.language})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="translation-context-select">Choose a translation edition:</label>
        <select id="translation-context-select" onChange={handleTranslationContextChange} value={translationContext?.identifier || ''}>
          <option value="" disabled>Select a translation edition</option>
          {editions.map((edition) => (
            <option key={edition.identifier} value={edition.identifier}>
              {edition.englishName} ({edition.language})
            </option>
          ))}
        </select>
      </div>
      <Welcome />
    </div>
  );
}

export default Home;
