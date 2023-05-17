package com.example.mall.JPAtest;


import com.example.mall.Constant.GoodsStatus;
import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Seller;
import com.example.mall.repository.GoodsRepository;
import com.example.mall.repository.SellerRepository;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest
public class Test {
    @Autowired
    private GoodsRepository goodsRepository;
    @Autowired
    private SellerRepository sellerRepository;

    @org.junit.Test
    public void addGoods() {
        Seller seller1  = new Seller(4L, "1","1","1","1","1",null); // 首先获取一个seller
//        Seller seller2  = new Seller(null, "2","2","2","2","2",null);
//        sellerRepository.save(seller1);
//        sellerRepository.save(seller2);
        for (int i = 0; i < 3; i++) {
            String temp = Integer.toString(i);
            BigDecimal bigDecimal= new BigDecimal(100);
            Goods goods = new Goods(null,temp,bigDecimal,temp,temp,bigDecimal,1L,temp,temp, GoodsStatus.ON_SALE,seller1);
            goodsRepository.save(goods);
        }
    }

    @org.junit.Test
    public void queryGoods() {
        List<Goods> goods = goodsRepository.findAllById(Collections.singletonList(5L));
        System.out.println(goods.toString());
    }
}
