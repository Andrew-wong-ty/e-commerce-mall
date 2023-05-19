package com.example.mall.service.impl;

import com.example.mall.constant.GoodsStatus;
import com.example.mall.POJO.Goods;
import com.example.mall.repository.GoodsRepository;
import com.example.mall.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class GoodsServiceImpl implements GoodsService {
    @Autowired
    private GoodsRepository goodsRepository;
    @Override
    public Page<Goods> getGoodsByStatus(GoodsStatus status, int nPage, int size, boolean sortByGoodsSales) {
        Pageable pageable;
        if(sortByGoodsSales) {
            Sort.TypedSort<Goods> goodsTypedSort = Sort.sort(Goods.class);
            Sort goodsSort = goodsTypedSort.by(Goods::getGoodsSales).descending();
            pageable = PageRequest.of(nPage, size, goodsSort);
        } else {
            pageable = PageRequest.of(nPage, size);
        }
        return goodsRepository.findAllByGoodsCurrStatus(status, pageable);
    }

    @Override
    public Goods getOneById(Long id) {
        return goodsRepository.findOneById(id);
    }
}
