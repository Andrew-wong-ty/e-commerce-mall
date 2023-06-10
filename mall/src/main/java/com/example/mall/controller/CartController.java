package com.example.mall.controller;

import com.example.mall.POJO.Cart;
import com.example.mall.POJO.DTO.ResponseObject;
import com.example.mall.service.CartService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/cart")
public class CartController {
    @Resource
    private CartService cartService;

    @RequestMapping(value = "/addOrUpdateCart", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject addOrUpdateCart(@RequestBody Map<String, String> paramMap) {
        try {
            Cart cart = cartService.getCartByUserIdAndGoodsId(
                    Long.parseLong(paramMap.get("userId")),
                    Long.parseLong(paramMap.get("goodsId"))
            );
            if(null!=cart) {
                cart.setNum(cart.getNum()+Long.parseLong(paramMap.get("num")));
                cartService.addOrUpdateCart(cart);
            } else {
                Cart newCart = new Cart();
                newCart.setNum(Long.parseLong(paramMap.get("num")));
                newCart.setGoodsId(Long.parseLong(paramMap.get("goodsId")));
                newCart.setUserId(Long.parseLong(paramMap.get("userId")));
                cartService.addOrUpdateCart(newCart);
            }
            return ResponseObject.success();
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    @RequestMapping(value = "/showUserCart", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject showUserCart(@RequestBody Map<String, String> paramMap) {
        try {
            Long userId = Long.parseLong(paramMap.get("userId"));
            int nPage = Integer.parseInt(paramMap.get("nthPage"));
            int pageSize = Integer.parseInt(paramMap.get("pageSize"));
            Map<String, Object> cart = cartService.findAllCartByUserId(userId, nPage-1, pageSize);
            return ResponseObject.success(cart);
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    @RequestMapping(value = "/deleteCart", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject deleteCart(@RequestBody Map<String, String> paramMap) {
        try {
            boolean deleteCart = cartService.deleteCartById(Long.parseLong(paramMap.get("cartId")));
            return deleteCart? ResponseObject.success():ResponseObject.error();
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }
}
