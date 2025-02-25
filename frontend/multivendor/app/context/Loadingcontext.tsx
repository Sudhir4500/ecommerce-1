// context/LoadingContext.tsx
'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import LoadingBar from '../components/loading/Loading';


// Define the type for the context value
interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create the context with a default value
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Define the provider component
interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <LoadingBar />} {/* Show loading bar when loading is true */}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};