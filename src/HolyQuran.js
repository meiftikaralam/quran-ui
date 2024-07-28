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
import axios from 'axios';
import './HolyQuran.css';

import MultiLineButton from './MultiLineButton.js';

function HolyQuran() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('https://api.alquran.cloud/v1/meta')
      .then(response => {
        setItems(response.data.data.surahs.references);
        console.log(items);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className="body">
      <div className="thumbnail-container">
        {items.map((item, index) => (
          <div key={index} className="thumbnail">
            <MultiLineButton item={item} surahList={items} />
          </div>
        ))}
      </div>
      </div>
  );
}

export default HolyQuran;
