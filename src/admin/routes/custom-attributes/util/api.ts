import axios from "axios";

export const $api = axios.create({
  baseURL: process.env.MEDUSA_BACKEND_URL,
  withCredentials: true,
});
