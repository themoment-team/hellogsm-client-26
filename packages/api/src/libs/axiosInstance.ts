import axios from 'axios';

import { authUrl } from 'api/libs';

export const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    return config;
  },
  async (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.url === authUrl.getLogout()) return response.data.status;

    if (response.status >= 200 && response.status <= 300) {
      return response.data.data;
    }

    return Promise.reject(response.data);
  },
  async (error) => {
    return Promise.reject(error);
  },
);
