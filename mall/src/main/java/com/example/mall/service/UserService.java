package com.example.mall.service;

import com.example.mall.POJO.Goods;
import com.example.mall.POJO.User;

public interface UserService {
    User loginByUsernameAndPassword(String username, String password);
    Boolean isUsernameExist(String username);
    User getUserById(Long id);
    boolean saveUser(User user);
}
