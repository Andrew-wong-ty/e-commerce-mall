package com.example.mall.repository;

import com.example.mall.constant.GoodsStatus;
import com.example.mall.POJO.Goods;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GoodsRepository extends JpaRepository<Goods, Long> {

    // 根据商品id查询某个商品
    @Query("select distinct g from Goods g where g.Id = ?1")
    Goods findOneById(Long id);

    // 根据商家选出所有的产品
    @Query("select g from Goods g where g.seller.Id = ?1 and g.goodsCurrStatus <> ?2")
    Page<Goods> findAllGoodsBySeller(Long sellerId, GoodsStatus goodsStatus , Pageable pageable);

    // 根据商品状态选出商品
    Page<Goods> findAllByGoodsCurrStatus(GoodsStatus goodsCurrStatus, Pageable pageable);
    // 根据销量排序得到指定数量的商品 (放在首页)
}
