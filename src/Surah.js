import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './lib/axios';
import EditionContext from './EditionContext';
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import './styles/quran.css';

const Surah = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { surah } = location.state || { surah: {} };
  const [ayahs, setAyahs] = useState([]);
  const [bismillahAyah, setBismillahAyah] = useState([]);
  const [edition, setEdition] = useState([]);
  const [translatedEdition, setTranslatedEdition] = useState([]);
  const [translatedAyahs, setTranslatedAyahs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(surah);
  const [loading, setLoading] = useState(false);
  const { textContext, translationContext } = useContext(EditionContext);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('surah');
  const [surahNumber, setSurahNumber] = useState(surah?.number || 1);
  const [juzNumber, setJuzNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!textContext || !translationContext) {
      navigate('/home');
      return;
    }

    fetchSurahData(surahNumber);
  }, [surahNumber, textContext, translationContext, navigate]);

  const fetchSurahData = (number) => {
    setLoading(true);
    setError(null);

    api.get(`/surah/${number}/editions/${textContext.identifier},${translationContext.identifier}`)
      .then(response => {
        const ayahs = response.data.data[0].ayahs;
        setEdition(response.data.data[0].edition);
        const translatedAyahs = response.data.data[1].ayahs;
        setAyahs(ayahs);
        setTranslatedAyahs(translatedAyahs);
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

  const handleSurahChange = async (value) => {
    const number = Number(value);
    setSurahNumber(number);
    setLoading(true);
    
    try {
      // Fetch surah metadata
      const metaResponse = await api.get('/meta');
      const surahList = metaResponse.data.data.surahs.references;
      const selected = surahList.find(surah => surah.number === number);
      
      if (selected) {
        setSelectedItem(selected);
        // Fetch the surah data with both text and translation
        await fetchSurahData(number);
        // Update the URL with the new surah data
        navigate(`/surah`, { state: { surah: selected } }, { replace: true });
      }
    } catch (error) {
      console.error('Error fetching surah data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/search/${searchQuery}/all/en`);
      setSearchResults(response.data.data.matches);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
      <Tabs defaultValue="surah" className="w-full mb-8" onValueChange={setActiveTab}>
        <div className="flex justify-center border-b">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="surah">Surah</TabsTrigger>
            <TabsTrigger value="juz">Juz</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="surah">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Surah #{selectedItem.number}</h2>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setSurahNumber(prev => Math.max(1, prev - 1))}
                      disabled={surahNumber <= 1}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <Select
                      value={surahNumber.toString()}
                      onValueChange={handleSurahChange}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Surah" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 114 }, (_, i) => i + 1).map((number) => (
                          <SelectItem key={number} value={number.toString()}>
                            {number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setSurahNumber(prev => Math.min(114, prev + 1))}
                      disabled={surahNumber >= 114}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-center">{selectedItem.name} ({selectedItem.englishName})</h1>
                {bismillahAyah && (
                  <h3 className="bismillah" dangerouslySetInnerHTML={{ __html: processTajweed(bismillahAyah) }} />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="quran-page">
            {ayahs.map((ayah, index) => (
              <div key={index} className="ayah">
                <div 
                  className="arabic-text"
                  style={{ 
                    direction: 'rtl',
                    textAlign: 'right',
                    fontFamily: 'Kitab, serif',
                    fontSize: '1.5rem',
                    lineHeight: '1.8'
                  }}
                >
                  <span className="ayah-number">{ayah.numberInSurah}</span>
                  <span dangerouslySetInnerHTML={{ __html: processTajweed(ayah.text) }} />
                  <span className="ayah-end">۝<span className="ayah-end-number">{ayah.numberInSurah}</span></span>
                </div>
                <div className="translation">
                  {translatedAyahs[index]?.text}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="juz" className="mt-4">
          <div className="flex justify-center p-4 mb-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setJuzNumber(prev => Math.max(1, prev - 1))}
                disabled={juzNumber <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Select
                value={juzNumber.toString()}
                onValueChange={(value) => setJuzNumber(Number(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Juz" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((number) => (
                    <SelectItem key={number} value={number.toString()}>
                      {number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setJuzNumber(prev => Math.min(30, prev + 1))}
                disabled={juzNumber >= 30}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="text-center text-muted-foreground">
            <p>Juz content will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="search" className="mt-4">
          <div className="flex justify-center p-4 mb-6">
            <div className="flex items-center gap-2 w-full max-w-md">
              <input 
                type="text" 
                placeholder="Search by surah number or name..." 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Surah {result.surah.number}</span>
                          <span className="text-muted-foreground">Ayah {result.numberInSurah}</span>
                        </div>
                        <p className="text-sm">{result.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>{searchQuery ? 'No results found' : 'Search results will appear here'}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Surah;
