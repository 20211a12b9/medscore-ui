import React, { createContext, useState, useContext } from 'react';

// Create the context with initial default values
export const AppContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

// Create a provider component
export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize isLoggedIn based on whether there's a valid token in localStorage
    return !!localStorage.getItem('jwttoken');
  });

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};