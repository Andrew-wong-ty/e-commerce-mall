package com.example.mall.JPAtest;


import com.example.mall.constant.GoodsStatus;
import com.example.mall.constant.OrderStatus;
import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Orders;
import com.example.mall.POJO.Seller;
import com.example.mall.POJO.User;
import com.example.mall.repository.GoodsRepository;
import com.example.mall.repository.OrdersRepository;
import com.example.mall.repository.SellerRepository;
import com.example.mall.repository.UserRepository;
import com.example.mall.service.OrderService;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class Test {
    @Autowired
    private GoodsRepository goodsRepository;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private OrderService orderService;

    @org.junit.Test
    public void findOrdersByUserId() {
        Page<Orders> orders = orderService.getPageOrdersByUserId("13", 5, 0);
        orders.forEach(item->{
            System.out.println(item.toString());
        });
    }

    @org.junit.Test
    public void fuzzySearch() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Goods> goods = goodsRepository.fuzzySearchByGoodsName("Name7", pageable);
        goods.forEach(item->{
            System.out.println(item.getGoodsName());
        });
    }

    @org.junit.Test
    public void findOrdersBySellerId() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Orders> orders = ordersRepository.findOrdersBySellerId(3L,pageable);
        orders.forEach(item->{
            System.out.println(item.toString());
        });
    }

    @org.junit.Test
    public void addGoods() {
        Seller seller1  = new Seller(4L, "1","1","1","1","1","1",null); // 首先获取一个seller
//        Seller seller2  = new Seller(null, "2","2","2","2","2",null);
//        sellerRepository.save(seller1);
//        sellerRepository.save(seller2);
//        for (int i = 0; i < 3; i++) {
//            String temp = Integer.toString(i);
//            BigDecimal bigDecimal= new BigDecimal(100);
//            Goods goods = new Goods(null,temp,bigDecimal,temp,temp,bigDecimal,1L,temp,temp, GoodsStatus.ON_SALE,seller1);
//            goodsRepository.save(goods);
//        }
    }

    @org.junit.Test
    public void queryGoods() {
//        List<Goods> goods = goodsRepository.findAllById(Collections.singletonList(5L));
        Sort.TypedSort<Goods> goodsTypedSort = Sort.sort(Goods.class);
        Sort goodsSort = goodsTypedSort.by(Goods::getGoodsSales).descending();
        Pageable pageable = PageRequest.of(0,3, goodsSort);
//        Page<Goods> goods2 = goodsRepository.findAll(pageable);
        Goods goods = goodsRepository.findOneById(5L);
        int a = 1;
    }


    @org.junit.Test
    public void addUsers() {
        User user1 = new User(null, "1111sdasd","sdasd","sdasd","sdasd","sdasd","sdasd");
        User user2 = new User(null, "2222sdasd","sdasd","sdasd","sdasd","sdasd","sdasd");
        userRepository.save(user1);
        userRepository.save(user2);
    }
    @org.junit.Test
    public void addOrders() {
//        List<Goods> goods = goodsRepository.findAllById(Collections.singletonList(5L));
//        List<User> users = userRepository.findAllById(Collections.singletonList(13L));
//        Orders orders = new Orders(null,users.get(0),goods.get(0),new BigDecimal(1000),10L,new Date(), OrderStatus.SIGNED);
//        ordersRepository.save(orders);
    }


}
