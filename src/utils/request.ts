import axios from "axios";
import { baseURL } from "./config";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 2000,
});

instance.interceptors.request.use((config) => {
    return config
}
)
instance.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)
export default instance