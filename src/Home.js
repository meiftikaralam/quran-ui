import React, { useState, useEffect, useContext } from 'react';
import EditionContext from './EditionContext';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import api from './lib/axios';

function Home() {
  const [editions, setEditions] = useState([]);
  const { textContext, setTextContext, translationContext, setTranslationContext } = useContext(EditionContext);

  useEffect(() => {
    api.get('/edition')
      .then(response => {
        const filteredEditions = response.data.data.filter(
          edition => edition.identifier === 'bn.bengali' || edition.identifier === 'en.sahih' || edition.identifier === 'hi.hindi'
        );
        setEditions(filteredEditions);
        const selectedTextContext = response.data.data.find(edition => edition.identifier === 'quran-unicode');
        const selectedTranslationContext = response.data.data.find(edition => edition.identifier === 'en.sahih');
        setTextContext(selectedTextContext);
        setTranslationContext(selectedTranslationContext);
      })
      .catch(error => {
        console.error('There was an error fetching the editions!', error);
      });
  }, [setTextContext, setTranslationContext]);

  const handleTranslationContextChange = (value) => {
    const selectedTranslationContext = editions.find(edition => edition.identifier === value);
    console.log('handleTranslationContextChange', selectedTranslationContext);
    setTranslationContext(selectedTranslationContext);
  };

  const handleSave = () => {
    setTextContext(textContext);
    setTranslationContext(translationContext);
    console.log('Context saved:', { textContext, translationContext });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <h2 className="text-xl text-muted-foreground">Learn, Excel and Enlighten</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="text-context-select" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Choose a text edition:
            </label>
            <Input
              id="text-context-select"
              readOnly
              value="quran-unicode"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="translation-context-select" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Choose a translation edition:
            </label>
            <Select
              value={translationContext?.identifier || ''}
              onValueChange={handleTranslationContextChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a translation edition" />
              </SelectTrigger>
              <SelectContent>
                {editions.map((edition) => (
                  <SelectItem key={edition.identifier} value={edition.identifier}>
                    {edition.englishName} ({edition.language})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            className="w-full"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
