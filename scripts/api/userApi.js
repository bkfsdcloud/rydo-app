import { api } from "./axiosConfig";

export const signUp = async (user) => {
  const response = await api.post("/api/v1/rydo/users/signup", user);
  return response;
};

export const genOtp = async (phone) => {
  const response = await api.post("/api/v1/rydo/users/generate-otp", { phone });
  return response;
};

export const verifyOtp = async (phone, otp) => {
  const response = await api.post("/api/v1/rydo/users/verify-otp", {
    phone,
    otp,
  });
  return response;
};

export const updateLastLocation = async (body) => {
  const response = await api.put("/api/v1/rydo/users/last-location", body);
  return response;
};

export const updateUser = async (body) => {
  const response = await api.put("/api/v1/rydo/users", body);
  return response;
};
