package com.example.mall.service;

import com.example.mall.constant.GoodsStatus;
import com.example.mall.POJO.Goods;
import org.springframework.data.domain.Page;

public interface GoodsService {
    public Page<Goods> getGoodsByStatus(GoodsStatus status, int nPage, int size, boolean sortByGoodsSales);

    public Goods getOneById(Long id);
}
