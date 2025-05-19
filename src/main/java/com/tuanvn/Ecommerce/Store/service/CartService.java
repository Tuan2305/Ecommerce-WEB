package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.*;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;

public interface CartService {
    public CartItem addCartItem(
        User user,
        Product product,
        String size,
        int quantity
    );
    public Cart findUserCart(User user);


}
