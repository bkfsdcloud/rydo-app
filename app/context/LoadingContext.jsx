
import { createContext, useEffect, useState } from 'react';
import { setLoadingRef } from '../../scripts/loadingRef';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoadingRef({ loading, setLoading });
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;