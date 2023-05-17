package com.example.mall.POJO;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart")
@Getter
@Setter
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id; // 主键
    private Long userId; // 外键  多对多关系,一个user可以对应多个goods, 一个goods可以对应多个user
    private Long goodsId; // 外键
    private Long num;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Cart cart = (Cart) o;
        return Id != null && Objects.equals(Id, cart.Id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Cart{" +
                "Id=" + Id +
                ", userId=" + userId +
                ", goodsId=" + goodsId +
                ", num=" + num +
                '}';
    }
}
