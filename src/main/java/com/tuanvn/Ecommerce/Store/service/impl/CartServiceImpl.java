package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.Cart;
import com.tuanvn.Ecommerce.Store.modal.CartItem;
import com.tuanvn.Ecommerce.Store.modal.Product;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.repository.CartItemRepository;
import com.tuanvn.Ecommerce.Store.repository.CartRepository;
import com.tuanvn.Ecommerce.Store.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public CartItem addCartItem(User user, Product product, String size, int quantity) {
        Cart cart= findUserCart(user);
        CartItem isPresent = cartItemRepository.findByCartAndProductAndSize(cart,product,size);

        if(isPresent == null){
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUserId(user.getId());
            cartItem.setSize(size);

            int totalPriceAll = quantity * product.getSellingPrice();
            cartItem.setSellingPrice(totalPriceAll);
            cartItem.setPrice(quantity*product.getPrice());

            cart.getCartItems().add(cartItem);
            cartItem.setCart(cart);

            return cartItemRepository.save(cartItem);
        }

        return isPresent;
    }


    @Override
    public Cart findUserCart(User user) {

        Cart cart = cartRepository.findByUserId(user.getId());

        int totalPriceAll = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;

        for(CartItem cartItem: cart.getCartItems()){
            totalPriceAll += cartItem.getPrice(); // có thể trả về null ở đây
            totalDiscountedPrice += cartItem.getSellingPrice(); // và null ở đây
            totalItem +=cartItem.getQuantity();
        }

        cart.setTotalPrice(totalPriceAll);
        cart.setTotalItem(totalItem);
        cart.setTotalSellingPrice(totalDiscountedPrice);
        cart.setDiscount(calculateDiscountPercentage(totalPriceAll, totalDiscountedPrice));

        return cart;
    }


    private int calculateDiscountPercentage(int price, int sellingPrice) {
        if(price <= 0 || sellingPrice > price){
            return 0;
        }
        double discount = (double) price - sellingPrice;
        double  discountPercentage = (discount/price)*100;
        return (int)discountPercentage;
    }
}
