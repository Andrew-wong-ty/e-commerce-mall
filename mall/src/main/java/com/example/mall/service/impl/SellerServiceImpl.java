package com.example.mall.service.impl;

import com.example.mall.POJO.Seller;
import com.example.mall.POJO.User;
import com.example.mall.repository.SellerRepository;
import com.example.mall.service.SellerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SellerServiceImpl implements SellerService {
    @Autowired
    private SellerRepository sellerRepository;
    @Override
    public Seller loginBySellerNameAndPassword(String sellerName, String password) {
        return sellerRepository.findSellerBySellerNameAndPassword(sellerName, password);
    }

    @Override
    public Seller findSellerById(String id) {
        Long idLong = Long.parseLong(id);
        return sellerRepository.findOneById(idLong);
    }

    @Override
    public boolean saveSeller(Seller seller) {
        try {
            Seller savedSeller = sellerRepository.save(seller);
            return savedSeller.getId() != null;
            // 保存成功
        } catch (Exception e) {
            log.error("saveUser错误=>{}",e.getMessage(), e);
            return false;
        }

    }
}
