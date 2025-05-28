package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.*;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;

import java.util.Set;

public interface CartService {
    public CartItem addCartItem(
        User user,
        Product product,
        String size,
        int quantity
    );
    public Cart findUserCart(User user);


    void clearCartAfterOrder(User user, Set<Order> orders);
}
