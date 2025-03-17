import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/';

const getCsrfToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}csrf-token/`, {
      withCredentials: true,
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Interceptor to add the CSRF token to requests if necessary
axiosInstance.interceptors.request.use(
  async (config) => {
    if (!config.headers['X-CSRFToken']) {
      const csrfToken = await getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const CONSTANTS = {
  AXIOS: axiosInstance,
  BASE_URL: BASE_URL,
};