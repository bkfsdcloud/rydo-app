let loadingRef = {
  loading: () => false,
  setLoading: () => {},
};

export const setLoadingRef = (controller) => {
  loadingRef = controller;
};

export const getLoadingRef = () => loadingRef;