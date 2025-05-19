package com.tuanvn.Ecommerce.Store.modal;

import jakarta.persistence.*;
import lombok.*;

import java.lang.ref.PhantomReference;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Deal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Integer discount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public HomeCategory getCategory() {
        return category;
    }

    public void setCategory(HomeCategory category) {
        this.category = category;
    }

    @OneToOne
    private HomeCategory category;

    public Deal(Object o, int i, HomeCategory category) {
    }
}
