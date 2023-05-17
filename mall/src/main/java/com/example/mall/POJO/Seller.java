package com.example.mall.POJO;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "seller")
@Getter
@Setter
public class Seller {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id;

    private String sellerName;

    private String storeName;

    private String password;

    private String email;

    private String phoneNumber;

    @OneToMany(mappedBy = "seller",fetch = FetchType.EAGER)
    private List<Goods> goodsList;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Seller seller = (Seller) o;
        return Id != null && Objects.equals(Id, seller.Id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Seller{" +
                "Id=" + Id +
                ", sellerName='" + sellerName + '\'' +
                ", storeName='" + storeName + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", goodsList=" + goodsList +
                '}';
    }
}
