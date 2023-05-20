import { createSlice } from '@reduxjs/toolkit'
import LocalStorageUtil from "../store/localStorageUtil";
import Constant from "../store/constant";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: {
            username: "-1",
            id: "-1",
            isLogin: false,
            avatarLink: "-1",
            identity: "-1", //游客
        },
        count: 0,

    },
    reducers: {
        increment: state => {
            state.count+=1;
        },
        setCount: (state, action) => {
            state.count = action.payload.count
        },
        // 重新初始化state, 适用于用户退出
        logoutStatus: state => {
            state.info.count = 0;
            state.info.username = "-1";
            state.info.id = "-1";
            state.info.isLogin = false;
            state.info.avatarLink = "-1";
            state.info.identity = "-1";
            // 把JWT token从本地移除
            LocalStorageUtil.removeData(Constant.JWT_TOKEN_KEY)
        },
        loginStatus: (state, action) => {
            state.info.username = action.payload.username;
            state.info.id = action.payload.userId;
            state.info.isLogin = true;
            // state.info.avatarLink = action.payload.avatarLink;
            state.info.identity = action.payload.identity
        }
    }
})

// Action creators are generated for each case reducer function
export const { logoutStatus, loginStatus, increment, setCount } = userSlice.actions

export default userSlice.reducer