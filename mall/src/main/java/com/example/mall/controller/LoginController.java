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
import java.util.Map;

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
    private static final String BUYER_NAME = "Buyer";
    private static final String SELLER_NAME = "Seller";

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    @ResponseBody
    public String loginTest(@RequestBody LoginDTO loginDTO) {
        return "1234";
    }


    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject register(@RequestBody Map<String, String> paramMap) {
        try {

            String address = paramMap.get("address");
            String avatar = paramMap.get("avatar");
            String email = paramMap.get("email");
            String identity = paramMap.get("identity");
            String username = paramMap.get("username");
            String password = paramMap.get("password");
            String phoneNumber = paramMap.get("phoneNumber");
            String storeName = null;
            if(paramMap.containsKey("storeName")) {
                storeName = paramMap.get("storeName");
            }
            if(identity.equals(BUYER_NAME)) {
                Boolean exist = userService.isUsernameExist(username);
                if(exist) {
                    return ResponseObject.error("Username Exist!");
                }
                User user = new User(null, username,password, address, email, phoneNumber, avatar);
                boolean saveUser = userService.saveUser(user);
                assert saveUser;
            } else if(identity.equals(SELLER_NAME)) {
                Seller seller = new Seller(null, username, storeName,password, email, phoneNumber, avatar, null);
                boolean saveSeller = sellerService.saveSeller(seller);
                assert saveSeller;
            } else {
                return ResponseObject.error();
            }
            return ResponseObject.success();


        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
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
