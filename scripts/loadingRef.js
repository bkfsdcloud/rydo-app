
let loadingRef = {
  showLoading: () => {},
  hideLoading: () => {}
};

export const setLoadingRef = (controller) => {
  loadingRef = controller;
};

export const getLoadingRef = () => loadingRef;