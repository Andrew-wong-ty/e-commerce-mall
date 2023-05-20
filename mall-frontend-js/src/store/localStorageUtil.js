class LocalStorageUtil {
    // 存储数据到 LocalStorage
    static setData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // 从 LocalStorage 获取数据
    static getData(key) {
        const value = localStorage.getItem(key);
        if (value === null) {
            return null
        } else if (value === undefined || value==="undefined") {
            return null
        } else {
            // 成功获取到值
            return JSON.parse(value);
        }

    }

    // 检查 LocalStorage 中是否存在指定的数据
    static hasData(key) {
        return localStorage.getItem(key) !== null;
    }

    // 从 LocalStorage 移除指定的数据
    static removeData(key) {
        localStorage.removeItem(key);
    }
}
if(false){
    // 示例用法
    const jwtToken = 'your_jwt_token';

// 存储 JWT token 到 LocalStorage
    LocalStorageUtil.setData('jwtToken', jwtToken);

// 检查 JWT token 是否存在
    if (LocalStorageUtil.hasData('jwtToken')) {
        // 获取 JWT token
        const storedToken = LocalStorageUtil.getData('jwtToken');
        console.log(storedToken);

        // 移除 JWT token
        LocalStorageUtil.removeData('jwtToken');
    }
}

export default LocalStorageUtil

