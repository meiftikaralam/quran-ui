import React from 'react';
import './MultiLineButton.css';
import { useNavigate } from 'react-router-dom';

const MultiLineButton = ({ item, surahList }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        //alert('hi' + item.name);
        navigate('/surah', { state: { item, surahList } });
    };

  return (
    <button className="multi-line-button" onClick={handleClick}>
        <span>{item.number}</span>
        <span>{item.name}</span>
        <span>{item.englishName}</span>
    </button>
  );
};

export default MultiLineButton;
