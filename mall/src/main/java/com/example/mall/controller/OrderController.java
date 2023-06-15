package com.example.mall.controller;

import com.example.mall.POJO.*;
import com.example.mall.POJO.DTO.ResponseObject;
import com.example.mall.constant.OrderStatus;
import com.example.mall.service.*;
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
import java.util.*;

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

    @Autowired
    private CartService cartService;

    @Autowired
    private SellerService sellerService;


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

    @RequestMapping(value = "/showSellerOrders", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject showSellerOrders(@RequestBody Map<String, String> paramMap) {
        try {
            String sellerId = paramMap.get("sellerId");
            int nPage = Integer.parseInt(paramMap.get("nthPage"));
            int pageSize = Integer.parseInt(paramMap.get("pageSize"));
            Map<String, Object> map = orderService.fetchPageOrdersBySellerId(sellerId, pageSize, nPage - 1);
            return ResponseObject.success(map);
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    @RequestMapping(value = "/makeDeliver", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject makeDeliver(@RequestBody Map<String, String> paramMap) {
        try {
            String orderId = paramMap.get("orderId");
            Orders order = orderService.findOneById(orderId);
            order.setOrderStatus(OrderStatus.DELIVERING);
            orderService.saveOrUpdate(order);
            return ResponseObject.success();
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    @RequestMapping(value = "/makeSigned", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject makeSigned(@RequestBody Map<String, String> paramMap) {
        try {
            String orderId = paramMap.get("orderId");
            Orders order = orderService.findOneById(orderId);
            order.setOrderStatus(OrderStatus.SIGNED);
            orderService.saveOrUpdate(order);
            return ResponseObject.success();
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }





    public Orders queuingOrder(Map<String, String> paramMap) {
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
        newOrder.setSeller(goods.getSeller());
        orderService.queueOrdering(newOrder);
        return newOrder;
    }

    @RequestMapping(value = "/deleteFailedOrder", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject multipleOrdering(@RequestBody Map<String, String> paramMap) {
        try {
            orderService.deleteOrderById(paramMap.get("orderId"));
            return ResponseObject.success();

        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }

    }

    @RequestMapping(value = "/multipleOrdering", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject multipleOrdering(@RequestBody List<Map<String, String>> paramMaps) {
        try {
            for(Map<String, String> paramMap : paramMaps) {
                // 生成订单放到队列中
                Orders newOrder = queuingOrder(paramMap);

                // 在数据库中存储订单信息
                boolean saveOrder = orderService.saveOrUpdate(newOrder);
                assert saveOrder;

                // 以上步骤成功, 则删除购物车中的对应选项
                Long cartId = Long.parseLong(paramMap.get("cartId"));
                cartService.deleteCartById(cartId);
            }
            return ResponseObject.success();
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    /**
     * "立即购买" 使用此API
     * @param paramMap 参数列表
     */
    @RequestMapping(value = "/ordering", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject ordering(@RequestBody Map<String, String> paramMap) {
        try {
            Orders newOrder = queuingOrder(paramMap);
            String orderUUID = newOrder.getId();

            // 在数据库中存储订单信息
            boolean saveOrder = orderService.saveOrUpdate(newOrder);
            assert saveOrder;

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
