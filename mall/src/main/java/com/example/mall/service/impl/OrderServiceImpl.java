package com.example.mall.service.impl;

import com.example.mall.POJO.Orders;
import com.example.mall.kafka.ConsumerThread;
import com.example.mall.kafka.QueueProducer;
import com.example.mall.repository.OrdersRepository;
import com.example.mall.service.OrderService;
import com.example.mall.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {
    @Autowired
    private QueueProducer producer;

    @Autowired
    private ConsumerThread consumer;

    @Autowired
    private OrdersRepository ordersRepository;

    /**
     * 开启消费者线程
     */
    @PostConstruct
    public void startThread() {
        Thread consumerThread = new Thread(consumer);
        consumerThread.start();
    }

    @Override
    public void queueOrdering(Orders singleOrder) {
        producer.send(singleOrder.getId(), singleOrder);
    }

    @Override
    public Page<Orders> getPageOrdersByUserId(String userId, int pageSize, int nthPage) {
        Pageable pageable = PageRequest.of(nthPage,pageSize);
        return ordersRepository.findOrdersByUserId(Long.parseLong(userId), pageable);
    }

    @Override
    public Map<String, Object> fetchPageOrdersBySellerId(String sellerId, int pageSize, int nthPage) {
        Pageable pageable = PageRequest.of(nthPage,pageSize);
        Page<Orders> orders = ordersRepository.findOrdersBySellerId(Long.parseLong(sellerId), pageable);
        assert orders!=null;
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> orderList = new ArrayList<>();
        for(Orders ordersTemp :orders.getContent()) {
            Map<String, Object> map = new HashMap<>();
            map.put("goodsName", ordersTemp.getGoods().getGoodsName());
            String[] split = ordersTemp.getGoods().getGoodsDetailImages().split(";");
            if(split.length>=1) {
                map.put("goodsImage", split[0]);
            } else {
                map.put("goodsImage", new String(""));
            }
            map.put("goodsNum", ordersTemp.getNum());
            map.put("orderId", ordersTemp.getId());
            map.put("goodsId", ordersTemp.getGoods().getId());
            map.put("address", ordersTemp.getUser().getAddress());
            map.put("username", ordersTemp.getUser().getUsername());
            map.put("totalPrice", ordersTemp.getOnSellPrice());
            map.put("orderStatus", ordersTemp.getOrderStatus());
            map.put("orderDateTime", DateUtils.formatDateTime(ordersTemp.getOrderDate()));
            orderList.add(map);
        }
        result.put("orders", orderList);
        result.put("totalElement", orders.getTotalElements());
        result.put("totalPages", orders.getTotalPages());
        return result;
    }

    @Override
    public Orders findOneById(String orderId) {
        return ordersRepository.findOneById(orderId);
    }

    @Override
    public Map<String, Object> fetchPageOrdersByUserId(String userId, int pageSize, int nthPage) {
        Page<Orders> orders = getPageOrdersByUserId(userId, pageSize,nthPage);
        assert orders!=null;
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> orderList = new ArrayList<>();
        for(Orders ordersTemp :orders.getContent()) {
            Map<String, Object> map = new HashMap<>();
            map.put("goodsName", ordersTemp.getGoods().getGoodsName());
            String[] split = ordersTemp.getGoods().getGoodsDetailImages().split(";");
            if(split.length>=1) {
                map.put("goodsImage", split[0]);
            } else {
                map.put("goodsImage", new String(""));
            }
            map.put("goodsNum", ordersTemp.getNum());
            map.put("orderId", ordersTemp.getId());
            map.put("goodsId", ordersTemp.getGoods().getId());
            map.put("address", ordersTemp.getUser().getAddress());
            map.put("sellerName", ordersTemp.getGoods().getSeller().getSellerName());
            map.put("totalPrice", ordersTemp.getOnSellPrice());
            map.put("orderStatus", ordersTemp.getOrderStatus());
            map.put("orderDateTime", DateUtils.formatDateTime(ordersTemp.getOrderDate()));
            orderList.add(map);
        }
        result.put("orders", orderList);
        result.put("totalElement", orders.getTotalElements());
        result.put("totalPages", orders.getTotalPages());
        return result;
    }

    @Override
    public boolean saveOrUpdate(Orders order) {
        try {
            assert StringUtils.isNotBlank(order.getId());
            Orders orders = ordersRepository.save(order);
            return orders.getId() != null;
            // 保存成功
        } catch (Exception e) {
            log.error("saveUser错误=>{}",e.getMessage(), e);
            return false;
        }
    }

    @Override
    public void deleteOrderById(String orderId) {
        ordersRepository.deleteById(orderId);
    }
}
