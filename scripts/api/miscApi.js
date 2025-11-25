import { api } from "./userApi";

export const allConfigs = async () => {
  const response = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/misc"
  );
  return response.data;
};

export const markFavourite = async (body) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/favourites",
    body
  );
  return response.data;
};

export const allFavourites = async () => {
  const response = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/favourites"
  );
  return response.data;
};

export const unmarkFavourite = async (params) => {
  const response = await api.delete(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/favourites",
    { params }
  );
  return response.data;
};

export const createWallet = async (body) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/wallet/create",
    body
  );
  return response.data;
};

export const allTransactions = async (config) => {
  const response = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/wallet/transaction",
    config
  );
  return response.data;
};

export const makeTransaction = async (body) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/wallet/transaction",
    body
  );
  return response.data;
};

export const rateRide = async (body) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/rating",
    body
  );
  return response.data;
};
