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
  const [ayas, setAyas] = useState([]);
  const [suraName, setSuraName] = useState('');
  const [juzName, setJuzName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const middleFrameRef = useRef(null);
  const { textContext, translationContext } = useContext(EditionContext);
  const { bismillahAyah, loading } = useContext(BismillahContext);

  const fetchAyas = async (surahNumber) => {
    try {
      setIsLoading(true);
      if (!textContext || !textContext.identifier) {
        console.error('Text context is not available');
        return;
      }
      
      const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${textContext.identifier}`);
      const surahData = response.data.data[0];
      console.log(surahData);
      setAyas(surahData.ayahs);
      setSuraName(surahData.englishName);
      setArabicName(surahData.name);
      setJuzName(`Juz ${surahData.ayahs[0].juz}`);
    } catch (error) {
      console.error('Error fetching ayas:', error);
    } finally {
      setIsLoading(false);
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
    <Card className="w-full max-w-5xl mx-auto my-8 shadow-lg">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold">{suraName}</h2>
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
              direction: textContext?.direction || 'rtl',
              textAlign: textContext?.direction === 'rtl' ? 'right' : 'left'
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
                {ayas.map(ayah => (
                  <div 
                    key={ayah.number} 
                    className="mb-6 group hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl md:text-3xl font-kitab leading-relaxed">
                        {ayah.text}
                      </span>
                      <span className="text-sm text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        ({ayah.numberInSurah})
                      </span>
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
