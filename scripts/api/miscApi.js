import { api } from "./axiosConfig";

export const allConfigs = async () => {
  const response = await api.get("/api/v1/rydo/misc");
  return response.data;
};

export const markFavourite = async (body) => {
  const response = await api.post("/api/v1/rydo/favourites", body);
  return response.data;
};

export const allFavourites = async () => {
  const response = await api.get("/api/v1/rydo/favourites");
  console.log("response :", response);
  return response.data;
};

export const unmarkFavourite = async (params) => {
  const response = await api.delete("/api/v1/rydo/favourites", { params });
  return response.data;
};

export const createWallet = async (body) => {
  const response = await api.post("/api/v1/rydo/wallet/create", body);
  return response.data;
};

export const allTransactions = async (config) => {
  const response = await api.get("/api/v1/rydo/wallet/transaction", config);
  return response.data;
};

export const makeTransaction = async (body) => {
  const response = await api.post("/api/v1/rydo/wallet/transaction", body);
  return response.data;
};

export const rateRide = async (body) => {
  const response = await api.post("/api/v1/rydo/rating", body);
  return response.data;
};
