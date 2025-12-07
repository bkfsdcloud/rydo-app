import { api } from "./axiosConfig";

export const createPayment = async (body) => {
  const response = await api.post("/api/v1/rydo/payment", body);
  return response.data;
};

export const updatePaymentStatus = async (body) => {
  const response = await api.put("/api/v1/rydo/payment/status", body);
  return response.data;
};

export const getPaymentStatus = async (params) => {
  const response = await api.get("/api/v1/rydo/payment/status", { params });
  return response.data;
};
