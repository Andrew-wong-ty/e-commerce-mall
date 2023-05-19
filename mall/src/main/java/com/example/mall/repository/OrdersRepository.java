package com.example.mall.repository;

import com.example.mall.POJO.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    // 根据用户id查询分页订单
    // 根据商家id查询出所有分页订单
}
