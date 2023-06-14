package com.example.mall.controller;

import com.example.mall.POJO.Cart;
import com.example.mall.POJO.DTO.ResponseObject;
import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Orders;
import com.example.mall.POJO.User;
import com.example.mall.constant.OrderStatus;
import com.example.mall.service.GoodsService;
import com.example.mall.service.OrderService;
import com.example.mall.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Controller
@RequestMapping("/order")
public class OrderController {
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private OrderService orderService;

    @Autowired
    private GoodsService goodsService;

    @Autowired
    private UserService userService;


    @RequestMapping(value = "/showUserOrders", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject showUserOrders(@RequestBody Map<String, String> paramMap) {
        try {
            String userId = paramMap.get("userId");
            int nPage = Integer.parseInt(paramMap.get("nthPage"));
            int pageSize = Integer.parseInt(paramMap.get("pageSize"));
            Map<String, Object> map = orderService.fetchPageOrdersByUserId(userId, pageSize, nPage - 1);
            return ResponseObject.success(map);
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }


    @RequestMapping(value = "/ordering", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject ordering(@RequestBody Map<String, String> paramMap) {
        try {
            Long userId = Long.parseLong(paramMap.get("userId"));
            Long goodsId = Long.parseLong(paramMap.get("goodsId"));
            BigDecimal goodsNum = BigDecimal.valueOf(Long.parseLong(paramMap.get("goodsNum")));
            User user = userService.getUserById(userId);
            Goods goods = goodsService.getOneById(goodsId);
            BigDecimal singlePrice = goods.getGoodsPrice();
            BigDecimal discount = goods.getGoodsDiscount();
            BigDecimal totalPrice = discount.multiply(singlePrice).multiply(goodsNum);

            // 生成订单
            String orderUUID = UUID.randomUUID().toString();
            Orders newOrder = new Orders();
            newOrder.setId(orderUUID);
            newOrder.setGoods(goods);
            newOrder.setUser(user);
            newOrder.setOnSellPrice(totalPrice);
            newOrder.setOrderStatus(OrderStatus.CREATING);
            newOrder.setOrderDate(new Date());
            newOrder.setNum(goodsNum.longValue());
            orderService.queueOrdering(newOrder);

            // 在数据库中存储订单信息
            boolean saveOrder = orderService.saveOrUpdate(newOrder);
            assert saveOrder;

//            // 在redis中存储订单信息
//            ValueOperations<String, Object> ops = redisTemplate.opsForValue();
//            ops.set(orderUUID, OrderStatus.CREATING.toString()); // 订单状态标记为创建中

            // 返回订单id给客户端
            Map<String, Object> result = new HashMap<>();
            result.put("orderId", orderUUID);
            return ResponseObject.success(result);
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }

    }
}
