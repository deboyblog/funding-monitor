import axios from "axios";
const api = axios.create({
  headers: {
    Cache: "no-cache"
  },
  //   withCredentials: true, // <=== add here
  timeout: 60000
});
export default api;
export const { get, post, put } = api;
