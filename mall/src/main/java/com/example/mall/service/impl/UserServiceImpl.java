package com.example.mall.service.impl;

import com.example.mall.POJO.Goods;
import com.example.mall.POJO.User;
import com.example.mall.repository.UserRepository;
import com.example.mall.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
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

    @Override
    public User getUserById(Long id) {
        return userRepository.findOneById(id);
    }

    @Override
    public boolean saveUser(User user) {
        try {
            User savedUser = userRepository.save(user);
            return savedUser.getId() != null;
            // 保存成功
        } catch (Exception e) {
            log.error("saveUser错误=>{}",e.getMessage(), e);
            return false;
        }

    }
}
