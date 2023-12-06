import axios from "axios";

const api = axios.create({
  baseURL: "http://10.81.53.207/backend",
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: [
    (data) => {
      return JSON.stringify(data);
    },
  ],
  transformResponse: [
    (data) => {
      return JSON.parse(data);
    },
  ],
});

export default api;
