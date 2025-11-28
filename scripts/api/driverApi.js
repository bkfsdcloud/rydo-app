import { api } from "./axiosConfig";

export const getAvailable = async (body) => {
  const response = await api.post("/api/drivers/available", body);
  return response;
};
