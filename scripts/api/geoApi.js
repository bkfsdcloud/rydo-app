import { api } from "../../scripts/api/userApi";

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
  const res = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/maps/route",
    {
      params: params,
    }
  );
  return res.data;
};

export const handleGetNavigation = async (params) => {
  const res = await api.get("/api/geo/navigation", {
    params: params,
  });
  return res.data;
};

export const handleAutocomplete = async (params) => {
  const res = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/maps/autocomplete",
    {
      params: params,
    }
  );
  return res.data.predictions;
};

export const getAddress = async (params) => {
  const res = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/maps/address",
    {
      params: params,
    }
  );
  return res.data;
};

export const getCoords = async (params) => {
  const res = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/maps/coords",
    {
      params: params,
    }
  );
  return res.data;
};
