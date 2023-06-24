package com.example.mall.service;

import com.example.mall.constant.GoodsCategory;
import com.example.mall.constant.GoodsStatus;
import com.example.mall.POJO.Goods;
import org.springframework.data.domain.Page;

import java.util.List;

public interface GoodsService {
    public Page<Goods> getGoodsByStatus(GoodsStatus status, int nPage, int size, boolean sortByGoodsSales);

    public Page<Goods> getOnSaleGoodsByCategory(GoodsCategory category, int nPage, int size, boolean sortByGoodsSales);

    public Goods getOneById(Long id);

    boolean saveGoods(Goods goods);

    Page<Goods> getPageGoodsBySellerId(String sellerId, int pageSize, int nthPage);

    void deleteById(String goodsId);

    Page<Goods> fuzzySearchViaGoodsName(String goodsName, int pageSize, int nthPage);
}
