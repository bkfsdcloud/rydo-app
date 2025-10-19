import { api } from '../../scripts/api/userApi';

export const handleGetDistance = async (params) => {
  const res = await api.get("/api/geo/distance", {
    params: params,
  });
  return res.data;
};

export const handleGetFare = async (params) => {
  const res = await api.get("/api/geo/fare", {
  params: params,
  });
  return res.data;
};

export const handleGetRoute = async (params) => {
  const res = await api.get("/api/geo/route", {
    params: params,
  });
  return res.data;
};

export const handleGetNavigation = async (params) => {
  const res = await api.get("/api/geo/navigation", {
    params: params,
  });
  return res.data;
};

export const handleAutocomplete = async (params) => {
  const res = await api.get("/api/geo/autocomplete", {
    params: params,
  });
  return res.data;
};
  