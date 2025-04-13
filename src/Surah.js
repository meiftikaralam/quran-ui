import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './lib/axios';
import EditionContext from './EditionContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Card, CardContent } from './components/ui/card';

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
              <h3 className="text-2xl text-center font-arabic">{bismillahAyah}</h3>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {ayahList.map((ayah, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-right font-arabic text-2xl">{ayah.text}</div>
                <div className="text-muted-foreground">{translatedAyahList[index]?.text}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Surah;
