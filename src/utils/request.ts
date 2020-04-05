import axios, { AxiosResponse, AxiosError } from "axios";
import { message } from "ant-design-vue";
const api = axios.create({
  headers: {
    Cache: "no-cache"
  },
  //   withCredentials: true, // <=== add here
  timeout: 60000
});
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (/404/.test(error.message)) {
      message.warn("404 NotFund！");
    } else {
      message.warn(`网络错误: ${error.message}`);
    }
    return false;
  }
);
export default api;
export const { get, post, put } = api;
