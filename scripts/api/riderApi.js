import { api } from './userApi';

export const createRide = async (body) => {
  const response = await api.post('/api/rides', body);
  return response;
};
  