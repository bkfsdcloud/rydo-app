import { api } from './userApi';

  export const handleGetDistance = async (params) => {
    const res = await api.get("/api/geo/distance", {
      params: params,
    });
    return res;
  };

  export const handleGetFare = async (params) => {
    const res = await api.get("/api/geo/fare", {
    params: params,
    });
    return res;
  };

  export const handleGetRoute = async (params) => {
    const res = await api.get("/api/geo/route", {
      params: params,
    });
    return res;
  };

  export const handleGetNavigation = async (params) => {
    const res = await api.get("/api/geo/navigation", {
      params: params,
    });
    return res;
  };