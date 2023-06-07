package com.example.mall.repository;

import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Seller;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    Seller findSellerBySellerNameAndPassword(String sellerName, String password);


    @Query("select distinct s from Seller s where s.Id = ?1")
    Seller findOneById(Long id);

}
