package com.example.mall.repository;

import com.example.mall.POJO.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    // 查询是否存在该用户名 (用户名只能有1个)
    Boolean existsUserByUsername(String username);
    // 根据用户名和密码查询出是否存在用户 (登录)
    Boolean existsUserByUsernameAndPassword(String username, String password);
    // 根据用户名和密码查询出用户 (显示用户信息页面)
    User findUserByUsernameAndPassword(String username, String password);
}
