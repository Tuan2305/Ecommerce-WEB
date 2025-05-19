package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.Product;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.modal.Wishlist;

public interface WishlistService {

    Wishlist createWishlist(User user);
    Wishlist getWishlistByUserId(User user);
    Wishlist addProductToWishlist(User user, Product product);

}
