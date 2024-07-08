import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Ayah() {
  const [message, setMessage] = useState('');
  const [translation, setTranslation] = useState('');

  useEffect(() => {
    axios.get('https://api.alquran.cloud/v1/ayah/262/editions/quran-uthmani,bn.bengali')
      .then(response => {
        const extractedText = response.data.data[0].text;
        console.log(extractedText);
        setMessage(extractedText);
        setTranslation(response.data.data[1].text);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>{message}</h2>
        <p>{translation}</p>
      </header>
    </div>
  );
}

const styles = {
  body: {
    padding: '20px',
    textAlign: 'center',
  }
};

export default Ayah;
