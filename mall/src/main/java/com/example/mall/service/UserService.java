package com.example.mall.service;

import com.example.mall.POJO.User;

public interface UserService {
    User loginByUsernameAndPassword(String username, String password);
    Boolean isUsernameExist(String username);
}
