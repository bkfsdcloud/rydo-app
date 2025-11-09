import { api } from './userApi';

export const createRide = async (body) => {
  const response = await api.post('https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride', body);
  return response;
};

export const activeRide = async (params) => {
  const response = await api.get('https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride/status');
  return response;
};


export const available = async (body) => {
  const response = await api.post('https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/ride/available', body);
  return response.data;
};