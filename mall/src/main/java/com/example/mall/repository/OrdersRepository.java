package com.example.mall.repository;

import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Orders;
import com.example.mall.constant.GoodsStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    // 根据用户id查询分页订单
    @Query("select o from Orders o where o.user.Id = ?1")
    Page<Orders> findOrdersByUserId(Long userId,Pageable pageable);
    // 根据商家id查询出所有分页订单
}
