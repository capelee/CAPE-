import React, { createContext, useContext, useState, useCallback } from 'react';

interface TutorialContextType {
  tutorialStep: number;
  nextTutorialStep: () => void;
  finishTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tutorialStep, setTutorialStep] = useState<number>(1);

  const nextTutorialStep = useCallback(() => {
    setTutorialStep(prev => {
      const next = prev + 1;
      if (next > 8) {
        return 0;
      }
      return next;
    });
  }, []);

  const finishTutorial = useCallback(() => {
    setTutorialStep(0);
  }, []);

  return (
    <TutorialContext.Provider value={{ tutorialStep, nextTutorialStep, finishTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
