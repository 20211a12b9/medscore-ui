import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from './config';

// Create the context with initial default values
export const AppContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  refreshToken: () => {},
  logout: () => {},
});

// Create a provider component
export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize isLoggedIn based on whether there's a valid token in localStorage
    return !!localStorage.getItem('jwttoken');
  });
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('pharmacy_name');
    localStorage.removeItem('dl_code');
    setIsLoggedIn(false);
    navigate('/login', { replace: true });
  };

  // const refreshToken = async () => {
  //   try {
  //     const currentToken = localStorage.getItem('jwttoken');
  //     const userId = localStorage.getItem('userId');
      
  //     if (!currentToken || !userId) {
  //       throw new Error('Missing token or userId');
  //     }

  //     const response = await fetch(`${config.API_HOST}/api/user/refreshToken`, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: {
  //         'Authorization': `Bearer ${currentToken}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
      
  //     if (data.jwttoken) {
  //       localStorage.setItem('jwttoken', data.jwttoken);
  //       console.log('Token refreshed successfully at:', new Date().toLocaleTimeString());
  //       setIsLoggedIn(true);
  //       return true;
  //     } else {
  //       throw new Error('No token in response');
  //     }
  //   } catch (error) {
  //     console.error('Token refresh failed:', error);
      
  //     if (error.message.includes('token') || error.message.includes('401') || error.message.includes('403')) {
  //       logout();
  //     }
  //     return false;
  //   }
  // };

  // const setupTokenRefresh = () => {
  //   const REFRESH_INTERVAL =14 * 60 * 1000; // 50 seconds

  //   // Initial check and refresh
  //   if (localStorage.getItem('jwttoken')) {
  //     refreshToken();
  //   }

  //   // Set up periodic refresh
  //   const refreshInterval = setInterval(refreshToken, REFRESH_INTERVAL);

  //   // Cleanup function
  //   return () => {
  //     clearInterval(refreshInterval);
  //     console.log('Token refresh interval cleared');
  //   };
  // };

  // // Initialize token refresh on component mount
  // useEffect(() => {
  //   const cleanup = setupTokenRefresh();
  //   return () => cleanup();
  // }, []);

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    // refreshToken,
    logout
  };

  return (
    <AppContext.Provider value={contextValue}>
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