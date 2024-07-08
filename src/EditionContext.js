import React, { createContext, useState } from 'react';

const EditionContext = createContext();

export const EditionProvider = ({ children }) => {
  const [textContext, setTextContext] = useState(null);
  const [translationContext, setTranslationContext] = useState(null);
  return (
    <EditionContext.Provider value={{ textContext, setTextContext, translationContext, setTranslationContext }}>
      {children}
    </EditionContext.Provider>
  );
};

export default EditionContext;
