package com.example.mall.service.impl;

import com.example.mall.POJO.Seller;
import com.example.mall.repository.SellerRepository;
import com.example.mall.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
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
}
