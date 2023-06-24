package com.example.mall.service;

import com.example.mall.POJO.Seller;
import com.example.mall.POJO.User;

public interface SellerService {
    Seller loginBySellerNameAndPassword(String sellerName, String password);
    Seller findSellerById(String id);
    boolean saveSeller(Seller seller);
}
