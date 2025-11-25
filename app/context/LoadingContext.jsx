import { createContext, useContext, useEffect, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    LoadingController.register({
      startLoading,
      stopLoading,
    });
  }, []);

  const startLoading = () => setLoadingCount((prev) => prev + 1);
  const stopLoading = () => setLoadingCount((prev) => Math.max(prev - 1, 0));

  return (
    <LoadingContext.Provider
      value={{ loadingCount, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
export const useLoading = () => useContext(LoadingContext);

let actions = null;

export const LoadingController = {
  register: (obj) => (actions = obj),
  start: () => actions?.startLoading(),
  stop: () => actions?.stopLoading(),
};
