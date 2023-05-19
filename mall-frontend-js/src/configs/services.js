import httpService from "./HttpService";

export const httpPost = (data) => httpService.post(`/login/doLogin`, data)

export const postLogin = (values) => httpService.post(`/login/doLogin`, {username:values.username, password:values.password, identity:values.identity})
