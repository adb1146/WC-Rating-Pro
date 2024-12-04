import React from 'react';

interface TutorialContextType {
  showTutorial: boolean;
  currentSection: string;
  setShowTutorial: (show: boolean) => void;
  setCurrentSection: (section: string) => void;
}

export const TutorialContext = React.createContext<TutorialContextType>({
  showTutorial: true,
  currentSection: '',
  setShowTutorial: () => {},
  setCurrentSection: () => {},
});

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [showTutorial, setShowTutorial] = React.useState(() => {
    const tutorialSeen = localStorage.getItem('tutorialSeen');
    return !tutorialSeen;
  });
  const [currentSection, setCurrentSection] = React.useState('');

  return (
    <TutorialContext.Provider 
      value={{ 
        showTutorial, 
        currentSection, 
        setShowTutorial, 
        setCurrentSection 
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = React.useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}