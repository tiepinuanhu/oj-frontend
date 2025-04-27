import axios from "axios";
import { baseURL } from "./config";
import { useUserStore } from "../store/user";
import { ElMessage } from "element-plus";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

/**
 * 请求拦截器
 * 放行登陆和注册url
 * 从localStorage中获取token，并添加到请求头中
 */
instance.interceptors.request.use((config) => {
    const userStore = useUserStore()
    const token = userStore.token;
    if (token) {
        console.log("token", token)
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
}
)


/**
 * 响应拦截器,获取后端返回的token并保存到本地存储中
 */
instance.interceptors.response.use(
    (response) => {
        const bearerToken = response.headers['authorization']
        if (bearerToken) {
            // 提取实际的 JWT token 字符串，去除 Bearer 前缀和多余空格
            const token = bearerToken.replace('Bearer ', '');
            // 存储 token 到本地存储
            const userStore = useUserStore()
            userStore.setToken(token)
        }
        return response.data
    },
    (error) => {
        if (error.response) {
            // 请求已发送，服务器返回了非 2xx 状态码
            console.error('请求出错，状态码:', error.response.status);
        } else if (error.request) {
            // 请求已发送，但没有收到响应
            console.error('没有收到服务器响应');
        } else {
            // 请求设置时出错
            console.error('请求设置出错:', error.message);
        }
        return Promise.reject(error);
    }
)
export default instance