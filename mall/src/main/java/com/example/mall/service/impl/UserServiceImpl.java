package com.example.mall.service.impl;

import com.example.mall.POJO.User;
import com.example.mall.repository.UserRepository;
import com.example.mall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public User loginByUsernameAndPassword(String username, String password) {
        return userRepository.findUserByUsernameAndPassword(username,password);
    }

    @Override
    public Boolean isUsernameExist(String username) {
        return userRepository.existsUserByUsername(username);
    }
}
