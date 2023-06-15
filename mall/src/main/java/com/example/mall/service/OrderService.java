package com.example.mall.service;

import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Orders;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface OrderService {
    /**
     * 把一个订单放入队列, 等待处理
     * @param singleOrder order
     */
    void queueOrdering(Orders singleOrder);

    Page<Orders> getPageOrdersByUserId(String userId, int pageSize, int nthPage);
    Map<String, Object> fetchPageOrdersByUserId(String userId, int pageSize, int nthPage);
    boolean saveOrUpdate(Orders order);
    void deleteOrderById(String orderId);
    Map<String, Object> fetchPageOrdersBySellerId(String sellerId, int pageSize, int nthPage);

    Orders findOneById(String orderId);
}
