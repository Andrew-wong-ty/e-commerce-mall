package com.example.mall.controller;

import com.example.mall.POJO.DTO.ResponseObject;
import com.example.mall.POJO.Goods;
import com.example.mall.POJO.User;
import com.example.mall.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/user")
public class UserController {
    @Resource
    private UserService userService;

    @RequestMapping(value = "/getUserInfo", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject getGoodsById(@RequestBody Map<String, String> paramMap) {
        try {
            User user = userService.getUserById(Long.parseLong(paramMap.get("userId")));
            return ResponseObject.success(user);
        } catch (Exception e) {
            log.error("getGoodsById ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    @RequestMapping(value = "/updateUserInfo", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject updateUserInfo(@RequestBody Map<String, String> paramMap) {
        try {
            User user = userService.getUserById(Long.parseLong(paramMap.get("userId")));
            user.setAddress(paramMap.get("address"));
            user.setAvatar(paramMap.get("avatar"));
            user.setUsername(paramMap.get("username"));
            user.setEmail(paramMap.get("email"));
            user.setPhoneNumber(paramMap.get("phoneNumber"));
            boolean saveUser = userService.saveUser(user);
            return saveUser ? ResponseObject.success():ResponseObject.error();
        } catch (Exception e) {
            log.error("updateUserInfo ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }
}
