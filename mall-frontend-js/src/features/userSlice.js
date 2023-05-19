import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        count: 0,
        username: "-1",
        id: "-1",
        isLogin: false,
        avatarLink: "-1",
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
            state.count = 0;
            state.username = "-1";
            state.id = "-1";
            state.isLogin = false;
            state.avatarLink = "-1";
        },
        loginStatus: (state, action) => {
            state.username = action.payload.username;
            state.id = action.payload.id;
            state.isLogin = true;
            state.avatarLink = action.payload.avatarLink;
        }
    }
})

// Action creators are generated for each case reducer function
export const { logoutStatus, loginStatus, increment, setCount } = userSlice.actions

export default userSlice.reducer