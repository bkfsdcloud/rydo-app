import { api } from "./userApi";

export const createRide = async (body) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride",
    body
  );
  return response.data;
};

export const activeRide = async (params) => {
  const response = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride/status"
  );
  return response.data;
};

export const available = async (body) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride/available",
    body
  );
  return response.data;
};

export const updateStatus = async (body) => {
  const response = await api.put(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride/status",
    body
  );
  return response.data;
};

export const driverStatus = async (params) => {
  const response = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride/driver",
    { params }
  );
  return response.data;
};

export const cancelRide = async (body) => {
  const response = await api.put(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride/cancel",
    body
  );
  return response.data;
};

export const rideHistory = async () => {
  const response = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/history"
  );
  return response.data;
};

export const rideHistoryDetails = async (params) => {
  const response = await api.get(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/history/details",
    { params }
  );
  return response.data;
};
