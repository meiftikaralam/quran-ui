/* import React from 'react';
import Body from './Body';

function HolyQuran() {
  return (
    <div className="App">
      <Body />
    </div>
  );
}

export default HolyQuran;
 */

import React, { useState, useEffect } from 'react';
import api from './lib/axios';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { useNavigate } from 'react-router-dom';

function HolyQuran() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/meta')
      .then(response => {
        setItems(response.data.data.surahs.references);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full h-full text-left"
                onClick={() => navigate(`/surah`, { state: { surah: item } })}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.number}.</span>
                    <span className="text-muted-foreground">{item.englishName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.revelationType} • {item.numberOfAyahs} verses
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default HolyQuran;
