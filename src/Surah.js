import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './lib/axios';
import EditionContext from './EditionContext';
import { Card, CardContent } from './components/ui/card';
import './styles/quran.css';

const Surah = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { surah } = location.state || { surah: {} };
  const [ayahList, setAyahList] = useState([]);
  const [bismillahAyah, setBismillahAyah] = useState([]);
  const [edition, setEdition] = useState([]);
  const [translatedEdition, setTranslatedEdition] = useState([]);
  const [translatedAyahList, setTranslatedAyahList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(surah);
  const [loading, setLoading] = useState(false);
  const { textContext, translationContext } = useContext(EditionContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!textContext || !translationContext) {
      navigate('/home');
      return;
    }

    if (surah && surah.number) {
      fetchSurahData(surah.number);
    }
  }, [surah, textContext, translationContext, navigate]);

  const fetchSurahData = (number) => {
    setLoading(true);
    setError(null);

    api.get(`/surah/${number}/editions/${textContext.identifier},${translationContext.identifier}`)
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
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    if (number !== 1 && number !== 9) {
      api.get(`/surah/1/editions/${textContext.identifier}`)
        .then(response => {
          const firstAyahList = response.data.data[0].ayahs;
          setBismillahAyah(firstAyahList[0].text);
        })
        .catch(error => {
          console.error('There was an error!', error);
          setError(error.message);
        });
    } else {
      setBismillahAyah(null);
    }
  };

  const processTajweed = (text) => {
    // This is a simplified version. In a production environment,
    // you would use a proper Tajweed parsing library
    const rules = {
      'ٱ': 'ham_wasl',
      'ۡ': 'slnt',
      'ٓ': 'madda_necessary',
      'ۚ': 'qalqalah',
      'ۖ': 'madda_obligatory',
      'ۢ': 'ikhf_shfw',
      'ۗ': 'ghn'
    };

    let result = '';
    let currentClass = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const rule = rules[char];
      
      if (rule) {
        if (currentClass) {
          result += '</span>';
        }
        currentClass = rule;
        result += `<span class="${rule}">`;
      }
      
      result += char;
      
      if (rule && i === text.length - 1) {
        result += '</span>';
      }
    }
    
    return result;
  };

  const handleSelectionChange = (event) => {
    const itemNumber = event.target.value;
    const selected = surahList.find(surah => surah.number.toString() === itemNumber);
    setSelectedItem(selected);
    fetchSurahData(itemNumber);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Surah #{selectedItem.number}</h2>
            <h1 className="text-3xl font-bold text-center">{selectedItem.name} ({selectedItem.englishName})</h1>
            {bismillahAyah && (
              <h3 className="bismillah" dangerouslySetInnerHTML={{ __html: processTajweed(bismillahAyah) }} />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="quran-page">
        {ayahList.map((ayah, index) => (
          <div key={index} className="ayah">
            <div className="quran-text tajweed">
              <span className="ayah-number">{ayah.numberInSurah}</span>
              <span dangerouslySetInnerHTML={{ __html: processTajweed(ayah.text) }} />
            </div>
            <div className="text-base text-muted-foreground mt-2">
              {translatedAyahList[index]?.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surah;
