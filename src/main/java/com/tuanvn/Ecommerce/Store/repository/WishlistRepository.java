package com.tuanvn.Ecommerce.Store.repository;

import com.tuanvn.Ecommerce.Store.modal.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Wishlist findByUserId(Long userId);
}
