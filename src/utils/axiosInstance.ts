import axios from "axios";
import { config } from "../config/environment";
const axiosInstance = axios.create({
  baseURL: config.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
