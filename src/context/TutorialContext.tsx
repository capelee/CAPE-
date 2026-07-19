import React, { createContext, useContext, useState, useCallback } from 'react';

interface TutorialContextType {
  tutorialStep: number;
  nextTutorialStep: () => void;
  finishTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tutorialStep, setTutorialStep] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem("mumu_tutorial_step");
      if (stored !== null) {
        return parseInt(stored, 10);
      }
      return 1;
    } catch {
      return 1;
    }
  });

  const nextTutorialStep = useCallback(() => {
    setTutorialStep(prev => {
      const next = prev + 1;
      if (next > 8) {
        try { sessionStorage.setItem("mumu_tutorial_step", "0"); } catch (e) {}
        return 0;
      }
      try { sessionStorage.setItem("mumu_tutorial_step", next.toString()); } catch (e) {}
      return next;
    });
  }, []);

  const finishTutorial = useCallback(() => {
    setTutorialStep(0);
    try { sessionStorage.setItem("mumu_tutorial_step", "0"); } catch (e) {}
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
