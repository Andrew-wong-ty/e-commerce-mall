package com.example.mall.service;

import com.example.mall.POJO.Cart;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface CartService {
    Map<String, Object> findAllCartByUserId(Long userId, int nPage, int size);
    boolean addOrUpdateCart(Cart cart);
    boolean deleteCartById(Long id);
    Cart getCartById(Long id);
    Cart getCartByUserIdAndGoodsId(Long userId, Long goodsId);
}
