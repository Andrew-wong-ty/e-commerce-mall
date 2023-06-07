import {postAccessToken} from "../configs/services";
import {loginStatus, logoutStatus} from "../features/userSlice";
export function validateIdentification(dispatch) {
    postAccessToken().then(res=>{
        const response = JSON.parse(res.data)
        dispatch(loginStatus(response.object))
    }).catch(err=>{
        console.log("本地无身份或身份过期, err:", err)
        dispatch(logoutStatus())
    })
}

export async function validateJwt() {
    return await postAccessToken()
}