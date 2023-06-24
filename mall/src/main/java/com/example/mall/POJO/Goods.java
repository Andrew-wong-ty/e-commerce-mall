package com.example.mall.POJO;

import com.example.mall.constant.GoodsCategory;
import com.example.mall.constant.GoodsStatus;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "goods")
@Getter
@Setter
public class Goods {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id;
    private String goodsName; //1
    private BigDecimal goodsPrice; //1
    private String goodsHeadline; //1
    private String goodsDescription;//1
    private BigDecimal goodsDiscount;//1
    private Long goodsSales;//1
    private Long goodsNum;//1
    @Column(length = 1023)
    private String goodsDetailImages;//1
    @Enumerated(EnumType.STRING)
    private GoodsCategory category;
    @Enumerated(EnumType.STRING)
    private GoodsStatus goodsCurrStatus;//1

    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false) // 会创建一个seller_id字段, 对应的是Seller中的主键
    private Seller seller;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Goods goods = (Goods) o;
        return Id != null && Objects.equals(Id, goods.Id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Goods{" +
                "Id=" + Id +
                ", goodsName='" + goodsName + '\'' +
                ", goodsPrice=" + goodsPrice +
                ", goodsHeadline='" + goodsHeadline + '\'' +
                ", goodsDescription='" + goodsDescription + '\'' +
                ", goodsDiscount=" + goodsDiscount +
                ", goodsSales=" + goodsSales +
                ", goodsDetailImages='" + goodsDetailImages + '\'' +
                ", goodsCurrStatus=" + goodsCurrStatus +
                '}';
    }
}
