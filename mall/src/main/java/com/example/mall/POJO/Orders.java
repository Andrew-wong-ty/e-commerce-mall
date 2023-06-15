package com.example.mall.POJO;


import com.example.mall.constant.OrderStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
@Getter
@Setter
public class Orders {
    @Id
    private String Id;

    @OneToOne(fetch=FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "goods_id", referencedColumnName = "id")
    private Goods goods;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", referencedColumnName = "id")
    private Seller seller;

    private BigDecimal onSellPrice;

    private Long num;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Override
    public String toString() {
        return "Order{" +
                "Id=" + Id +
                ", user=" + user.getId() +
                ", goods=" + goods.getId() +
                ", goodsName=" + goods.getGoodsName() +
                ", num=" + num +
                ", orderDate=" + orderDate +
                ", status=" + orderStatus +
                '}';
    }
}
