import { api } from "./axiosConfig";

export const handleGetRoute = async (params) => {
  const res = await api.get("/api/v1/rydo/maps/route", {
    params: params,
    skipGlobalLoader: true,
  });
  return res.data;
};

export const handleAutocomplete = async (params) => {
  const res = await api.get("/api/v1/rydo/maps/autocomplete", {
    params: params,
  });
  return res.data.predictions;
};

export const getAddress = async (params) => {
  const res = await api.get("/api/v1/rydo/maps/address", {
    params: params,
    skipGlobalLoader: true,
  });
  return res.data;
};

export const getCoords = async (params) => {
  const res = await api.get("/api/v1/rydo/maps/coords", {
    params: params,
  });
  return res.data;
};
