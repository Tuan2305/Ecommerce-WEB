package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.modal.Product;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.modal.Wishlist;
import com.tuanvn.Ecommerce.Store.repository.ProductRepository;
import com.tuanvn.Ecommerce.Store.service.ProductService;
import com.tuanvn.Ecommerce.Store.service.UserService;
import com.tuanvn.Ecommerce.Store.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;
    private final ProductService productService;


    public WishlistController(WishlistService wishlistService, UserService userService, ProductService productService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
        this.productService = productService;
    }

    @GetMapping()
    public ResponseEntity<Wishlist> getWishlistByUserId(
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Wishlist wishlist = wishlistService.getWishlistByUserId(user);

        return ResponseEntity.ok(wishlist);

    }
    @PostMapping("/add_product/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception{
        Product product = productService.findProductById(productId);
        User user = userService.findUserByJwtToken(jwt);
        Wishlist updateWishlist = wishlistService.addProductToWishlist(user, product);
        return ResponseEntity.ok(updateWishlist);
    }


}
