package com.example.mall.controller;

import com.example.mall.POJO.DTO.LoginDTO;
import com.example.mall.POJO.DTO.ResponseObject;
import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Seller;
import com.example.mall.POJO.User;
import com.example.mall.service.SellerService;
import com.example.mall.service.UserService;
import com.example.mall.utils.Constant;
import com.example.mall.utils.CookieUtil;
import com.example.mall.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/login")
public class LoginController {
    @Resource
    private UserService userService;

    @Resource
    private SellerService sellerService;

    private static final String BUYER_IDENTITY = "0";
    private static final String SELLER_IDENTITY = "1";

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    @ResponseBody
    public String loginTest(@RequestBody LoginDTO loginDTO) {
        return "1234";
    }

    @RequestMapping(value = "/doLogin", method = RequestMethod.POST)
    @ResponseBody
//    @Transactional
    public ResponseObject login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        if(loginDTO.getIdentity().equals(BUYER_IDENTITY)) {
            User user = userService.loginByUsernameAndPassword(loginDTO.getUsername(), loginDTO.getPassword());
            if (user!=null){
                String token = JwtUtil.generateLoginToken(user.getId().toString(), user.getUsername(), BUYER_IDENTITY, user.getAvatar());
                response.setHeader("Authorization", token);
                CookieUtil.setCookie(response, Constant.JWT_COOKIE_KEY, token);
                return ResponseObject.success(user);
            } else {
                return ResponseObject.error();
            }
        } else if(loginDTO.getIdentity().equals(SELLER_IDENTITY)) {
            Seller seller = sellerService.loginBySellerNameAndPassword(loginDTO.getUsername(), loginDTO.getPassword());
            if (seller!=null){
                String token = JwtUtil.generateLoginToken(seller.getId().toString(), seller.getSellerName(), SELLER_IDENTITY, seller.getAvatar());
                response.setHeader("Authorization", token);
                CookieUtil.setCookie(response, Constant.JWT_COOKIE_KEY, token);
                return ResponseObject.success(seller);
            } else {
                return ResponseObject.error();
            }

        } else {
            return ResponseObject.error();
        }

    }
}
