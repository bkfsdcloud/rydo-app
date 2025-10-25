import { api } from './userApi';

export const createRide = async (body) => {
  const response = await api.post('/api/rides', body);
  return response;
};

export const activeRide = async (params) => {
  const response = await api.get('/api/rides/active');
  return response;
};