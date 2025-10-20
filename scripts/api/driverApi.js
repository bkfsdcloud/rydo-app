import { api } from './userApi';

export const getAvailable = async (body) => {
  const response = await api.post('/api/drivers/available', body);
  return response;
};
  