import axios from "axios";

// Duplicating this snippet due to a bug in the parser
export const $api = axios.create({
  baseURL: process.env.MEDUSA_BACKEND_URL,
  withCredentials: true,
});
