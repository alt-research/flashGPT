import { authUtil } from './auth';
import axios from 'axios';

export const instance = axios.create({
  baseURL: window.appConfig.baseUrl,
});

instance.interceptors.request.use(config => {
  config.headers = authUtil.getAuthHeaders();

  return config;
});
