package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.Product;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.modal.Wishlist;
import com.tuanvn.Ecommerce.Store.repository.WishlistRepository;
import com.tuanvn.Ecommerce.Store.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    private final WishlistRepository wishlistRepository;

    public WishlistServiceImpl(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    @Override
    public Wishlist createWishlist(User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

    @Override
    public Wishlist getWishlistByUserId(User user) {
        Wishlist wishlist=  wishlistRepository.findByUserId(user.getId());
        if(wishlist == null){
            wishlist= createWishlist(user);
        }
        return wishlist;
    }

    @Override
    public Wishlist addProductToWishlist(User user, Product product) {
        Wishlist wishlist = getWishlistByUserId(user);
        if(wishlist.getProducts().contains(product)){
            wishlist.getProducts().remove(product);
        }
        else{
            wishlist.getProducts().add(product);
        }
        return wishlistRepository.save(wishlist);

    }
}
