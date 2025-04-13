import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import EditionContext from '../EditionContext';

const BismillahContext = createContext();

export const BismillahProvider = ({ children }) => {
  const [bismillahAyah, setBismillahAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const { textContext } = React.useContext(EditionContext);

  useEffect(() => {
    const fetchBismillahAyah = async () => {
      try {
        if (!textContext || !textContext.identifier) {
          console.log('Text context or identifier is not available yet');
          setLoading(false);
          return;
        }
        const response = await axios.get(`https://api.alquran.cloud/v1/surah/1/editions/${textContext.identifier}`);
        const firstAyahList = response.data.data[0].ayahs;
        setBismillahAyah(firstAyahList[0].text);
        console.log('BismillahAyah:', firstAyahList[0].text);
      } catch (error) {
        console.error('There was an error!', error);
      } finally {
        setLoading(false);
      }
    };

    if (!bismillahAyah) {
      fetchBismillahAyah();
    }
  }, [bismillahAyah, textContext]);

  return (
    <BismillahContext.Provider value={{ bismillahAyah, setBismillahAyah, loading }}>
      {children}
    </BismillahContext.Provider>
  );
};

export default BismillahContext;
