import axios from "axios";
import LocalStorageUtil from "../store/localStorageUtil"
import Constant from "../store/constant";
const httpService = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 4000,
    headers: {'X-Custom-Header': 'foobar'},
    withCredentials: true,
    transformRequest: [function (data, headers) {
        // 对发送的 data 进行任意转换处理
        console.log("request拦截器data:",data)
        data = JSON.stringify(data)
        return data;
    }],
    transformResponse: [function (data) {
        // 对接收的 data 进行任意转换处理
        console.log("response接收器data:",data)
        return data;
    }],
});
// 允许cookie
httpService.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8';
httpService.defaults.headers['Access-Control-Allow-Origin'] = '*';
httpService.interceptors.response.use(
    (response) => {
        const authorization = response.headers['authorization'];
        LocalStorageUtil.setData(Constant.JWT_TOKEN_KEY, authorization)
        return response
    },
    (error) => {
        console.log("Error in httpService.interceptors.response.use")
        return Promise.reject(error);
    }
)
export default httpService