/**
 * 全局变量单例
 */
class GlobalState {
    constructor() {
        if (GlobalState.instance) {
            return GlobalState.instance;
        }

        this.state = {
            isLoggedIn: false,
            userId: "-1",
            username: "-1",
            identity: "-1", //-1游客, 0 已登录的买家, 1已登录的卖家
            // 其他状态...
        };

        GlobalState.instance = this;
    }


    setUserLoggedInStatus(response) {
        this.state.isLoggedIn = true;
        this.state.userId = response.id;
        this.state.username = response.username;
        this.state.identity = "0";
    }

    isLoggedIn() {
        return this.state.isLoggedIn;
    }

    // 其他状态的设置和获取方法...
}
const globalState = new GlobalState();
export default globalState