import { createContext, useEffect, useState } from "react";
import { setLoadingRef } from "../../scripts/loadingRef";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  // const [loading, setLoading] = useState(false);

  const [loadingState, setLoadingState] = useState({
    visible: false,
    message: "",
    button: "",
    callback: null,
  });

  const showLoading = (
    message = "Loading...",
    button = null,
    callback = null
  ) => {
    setLoadingState({ visible: true, message, button, callback });
  };

  const hideLoading = () => {
    setLoadingState({
      visible: false,
      message: "",
      button: "",
      callback: null,
    });
  };

  useEffect(() => {
    setLoadingRef({ ...loadingState, showLoading, hideLoading });
  }, []);

  return (
    <LoadingContext.Provider
      value={{ ...loadingState, showLoading, hideLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
