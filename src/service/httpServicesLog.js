import axios from 'axios';
import { getSession } from '../utils/Crypto';
import { URL_API_LOG } from './Config';

const instance = axios.create({
  baseURL: URL_API_LOG(''),
  timeout: 500000,
  headers: {
    // Accept: 'application/json',
    // 'Content-Type': 'application/json',
    // 'Content-Type': 'multipart/form-data'
  },
});

instance.interceptors.request.use(function (config) {
  return {
    ...config,
    headers: { Authorization: "Bearer " + getSession("login").result.token }
  };
});

const responseBody = (response) => response.data;

const requests = {
  get: (url, body) => instance.get(url, body).then(responseBody),
  post: (url, body, headers) => instance.post(url, body, headers).then(responseBody),
  put: (url, body) => instance.put(url, body).then(responseBody),
  delete: (url, { }, headers) => instance.delete(url, headers).then(responseBody),
  fromDataPost: (url, body, headers) => instance.post(url, body, { headers: { Authorization: "Bearer " + getSession("login").token, 'Content-Type': 'multipart/form-data' } }).then(responseBody),
  fromDataPut: (url, body, headers) => instance.put(url, body, { headers: { Authorization: "Bearer " + getSession("login").token, 'Content-Type': 'multipart/form-data' } }).then(responseBody),
};

export default requests;
