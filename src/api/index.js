import { authUtil } from './auth';
import axios from 'axios';

export const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

instance.interceptors.request.use(config => {
  config.headers = authUtil.getAuthHeaders();

  return config;
});
