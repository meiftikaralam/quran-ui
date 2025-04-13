import React, { useState, useEffect, useRef, useContext } from 'react';
import EditionContext from '../EditionContext';
import BismillahContext from '../context/BimillahContext';
import '../css/font-kitab.css';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, BookOpen, Bookmark } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const QuranReader = () => {
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahs, setAyahs] = useState([]);
  const [surahName, setSurahName] = useState('');
  const [juzName, setJuzName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const middleFrameRef = useRef(null);
  const { textContext, translationContext } = useContext(EditionContext);
  const { bismillahAyah, loading } = useContext(BismillahContext);

  const processTajweed = (text) => {
    // Define Tajweed rules and their corresponding CSS classes
    const tajweedRules = {
      'ٱ': 'ham_wasl',      // Hamza Wasl
      'ۡ': 'slnt',          // Sakin
      'ٓ': 'madda',         // Madda
      'ۚ': 'qalqalah',      // Qalqalah
      'ۖ': 'madda_obligatory', // Madda Obligatory
      'ۢ': 'ikhf_shfw',     // Ikhfa Shafawi
      'ۗ': 'ghn',           // Ghunnah
      'ۙ': 'idgham',        // Idgham
      'ۘ': 'ikhfa',         // Ikhfa
      'ۛ': 'iqlab',         // Iqlab
      'ۜ': 'idgham_shafawi', // Idgham Shafawi
      '۟': 'idgham_mutajanisayn', // Idgham Mutajanisayn
      '۠': 'idgham_mutamathilayn', // Idgham Mutamathilayn
      'ۣ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۤ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۥ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۦ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۧ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۨ': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۩': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۪': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۫': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۬': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۭ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۮ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۯ': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۰': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۱': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۲': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۳': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۴': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۵': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۶': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۷': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۸': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۹': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۺ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۻ': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۼ': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۽': 'ikhfa_shafawi', // Ikhfa Shafawi
      '۾': 'ikhfa_shafawi', // Ikhfa Shafawi
      'ۿ': 'ikhfa_shafawi', // Ikhfa Shafawi
    };

    let result = '';
    let currentClass = '';
    let buffer = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const rule = tajweedRules[char];

      if (rule) {
        // If we have a buffered text and we're changing classes, close the previous span
        if (buffer && currentClass !== rule) {
          result += `<span class="${currentClass}">${buffer}</span>`;
          buffer = '';
        }
        currentClass = rule;
        buffer += char;
      } else {
        // If we have a buffered text and we're not in a special character, close the span
        if (buffer) {
          result += `<span class="${currentClass}">${buffer}</span>`;
          buffer = '';
          currentClass = '';
        }
        result += char;
      }
    }

    // Handle any remaining buffered text
    if (buffer) {
      result += `<span class="${currentClass}">${buffer}</span>`;
    }

    return result;
  };

  const fetchAyahs = async (surahNumber) => {
    try {
      setIsLoading(true);
      if (!textContext || !textContext.identifier) {
        console.error('Text context is not available');
        return;
      }
      
      const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${textContext.identifier}`);
      const surahData = response.data.data[0];
      console.log(surahData);
      setAyahs(surahData.ayahs);
      setSurahName(surahData.englishName);
      setArabicName(surahData.name);
      setJuzName(`Juz ${surahData.ayahs[0].juz}`);
    } catch (error) {
      console.error('Error fetching ayahs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAyahs(surahNumber);
  }, [surahNumber, textContext, translationContext]);

  useEffect(() => {
    if (middleFrameRef.current) {
      middleFrameRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [ayahs]);

  const changeSurah = (direction) => {
    if (direction === 'left' && surahNumber > 1) {
      setSurahNumber(surahNumber - 1);
    } else if (direction === 'right' && surahNumber < 114) {
      setSurahNumber(surahNumber + 1);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto my-8 shadow-lg">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold">{surahName}</h2>
          <p className="text-lg text-muted-foreground">{arabicName}</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => changeSurah('left')}
                  disabled={surahNumber <= 1}
                  className="h-10 w-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous Surah</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Select
            value={surahNumber.toString()}
            onValueChange={(value) => setSurahNumber(Number(value))}
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => changeSurah('right')}
                  disabled={surahNumber >= 114}
                  className="h-10 w-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Surah</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-medium">{juzName}</h3>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="p-0">
        <div 
          className="overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" 
          id="middleFrame" 
          ref={middleFrameRef}
        >
          <div 
            className="p-8 md:p-12" 
            id="quranText"
            style={{ 
              direction: 'rtl',
              textAlign: 'right',
              fontFamily: 'Kitab, serif',
              fontSize: '1.25rem',
              lineHeight: '1.8'
            }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {!loading && bismillahAyah && surahNumber !== 1 && surahNumber !== 9 && (
                  <div className="text-center mb-8">
                    <span className="text-4xl md:text-5xl font-kitab leading-relaxed">
                      {bismillahAyah}
                    </span>
                    <Separator className="my-6" />
                  </div>
                )}
                {ayahs.map(ayah => (
                  <div 
                    key={ayah.number} 
                    className="mb-6 group hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className="quran-text tajweed" style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
                        <span className="ayah-number">{ayah.numberInSurah}</span>
                        <span dangerouslySetInnerHTML={{ __html: processTajweed(ayah.text) }} />
                        <span className="ayah-end">۝<span className="ayah-end-number">{ayah.numberInSurah}</span></span>
                      </div>
                    </div>
                    <Separator className="my-4 opacity-50" />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Read</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <Bookmark className="h-4 w-4" />
            <span>Bookmark</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => changeSurah('left')}
                  disabled={surahNumber <= 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous Surah</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Select
            value={surahNumber.toString()}
            onValueChange={(value) => setSurahNumber(Number(value))}
          >
            <SelectTrigger className="w-[100px] h-8">
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => changeSurah('right')}
                  disabled={surahNumber >= 114}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Surah</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuranReader;
