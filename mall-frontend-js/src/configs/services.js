import httpService from "./HttpService";
import LocalStorageUtil from "../store/localStorageUtil";
import Constant from "../store/constant";
export const httpPost = (data) => httpService.post(`/login/doLogin`, data)

export const postLogin = (values) => httpService.post(`/login/doLogin`, {username:values.username, password:values.password, identity:values.identity})

export const postAccessToken = () => {
    const jwtToken = LocalStorageUtil.getData(Constant.JWT_TOKEN_KEY);
    if(jwtToken==null) {
        return Promise.reject(new Error('Promise Error'));
    }
    return httpService.post("/security/jwtValidate", jwtToken);
}

export const postRegister = (data) => httpService.post('/login/register', data)

export const postNewProduct = (data) => httpService.post('/goods/new', data)

export const getProductBySellerId = (data) => httpService.post('/goods/getProductById', data)

export const getAllOnSaleProducts = (data) => httpService.post('/goods/getAllGoods', data)

export const getFuzzySearchProducts = (data) => httpService.post('/goods/fuzzySearch', data)

export const getGoodsByCategory = (data) => httpService.post('/goods/getAllGoodsByCategory', data)

export const getGoodsByGoodsId = (data) => httpService.post('/goods/getGoodsById', data)

export const getUserByUserId = (data) => httpService.post('/user/getUserInfo', data)

export const postUpdateUserinfo = (data) => httpService.post('/user/updateUserInfo', data)

export const postAddOrUpdateCart = (data) => httpService.post('/cart/addOrUpdateCart', data)

export const postGetUserCart = (data) => httpService.post('/cart/showUserCart', data)

export const postDeleteCart = (data) => httpService.post('/cart/deleteCart', data)

export const postGetUserOrder = (data) => httpService.post('/order/showUserOrders', data)

export const postGetSellerOrder = (data) => httpService.post('/order/showSellerOrders', data)

export const postMultipleOrdering = (data) => httpService.post('/order/multipleOrdering', data)

export const postDeleteFailedOrder = (data) => httpService.post('/order/deleteFailedOrder', data)

export const postMakeSigned = (data) => httpService.post('/order/makeSigned', data)

export const postMakeDeliver = (data) => httpService.post('/order/makeDeliver', data)