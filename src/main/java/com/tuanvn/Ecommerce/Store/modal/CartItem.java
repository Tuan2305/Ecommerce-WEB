package com.tuanvn.Ecommerce.Store.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.security.PrivateKey;

@Entity

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)

    private Long id;

    @ManyToOne// Liên kết với bảng Cart
    @JsonIgnore
    private Cart cart;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }




    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(Integer sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    @ManyToOne// Liên kết với bảng Product
    private Product product;

    private String size;

    private int quantity = 1;

    private Integer price ; // Giong nhw mrpPrice

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {

        this.price = price;

    }

    private Integer sellingPrice ;

    private Long userId;

}
