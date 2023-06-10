package com.example.mall.service.impl;

import com.example.mall.POJO.Cart;
import com.example.mall.POJO.Goods;
import com.example.mall.repository.CartRepository;
import com.example.mall.repository.GoodsRepository;
import com.example.mall.service.CartService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
@Slf4j
public class CartServiceImpl implements CartService {
    @Resource
    private CartRepository cartRepository;
    @Resource
    private GoodsRepository goodsRepository;

    @Override
    public Map<String, Object> findAllCartByUserId(Long userId, int nPage, int size) {
        Pageable pageable = PageRequest.of(nPage, size);
        Page<Cart> cart = cartRepository.findCartByUserId(userId, pageable);
        List<Map<String, Object>> goodsList = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();
        cart.getContent().forEach(cartItem->{
            Goods goods = goodsRepository.findOneById(cartItem.getGoodsId());
            Map<String, Object> map = new HashMap<>();
            map.put("goodsId", goods.getId());
            map.put("cartId", cartItem.getId());
            map.put("goodsName", goods.getGoodsName());
            map.put("goodsNum", cartItem.getNum());
            map.put("goodsPrice", goods.getGoodsPrice());
            map.put("goodsDiscount", goods.getGoodsDiscount());
            String[] split = goods.getGoodsDetailImages().split(";");
            if(split.length>=1) {
                map.put("goodsImage", split[0]);
            } else {
                map.put("goodsImage", new String(""));
            }
            goodsList.add(map);
        });
        result.put("carts", goodsList);
        result.put("totalElement", cart.getTotalElements());
        result.put("totalPages", cart.getTotalPages());
        return result;
    }

    @Override
    public boolean addOrUpdateCart(Cart cart) {
        try {
            Cart savedCart = cartRepository.save(cart);
            return savedCart.getId() != null;
            // 保存成功
        } catch (Exception e) {
            log.error("saveGoods错误=>{}",e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean deleteCartById(Long id) {
        try {
            cartRepository.deleteById(id);
            return true;
            // 保存成功
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Cart getCartById(Long id) {
        return cartRepository.getOneById(id);
    }

    @Override
    public Cart getCartByUserIdAndGoodsId(Long userId, Long goodsId) {
        return cartRepository.getOneByGoodsIdAndUserId(goodsId, userId);
    }
}
