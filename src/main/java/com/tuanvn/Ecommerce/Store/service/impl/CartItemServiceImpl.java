package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.Cart;
import com.tuanvn.Ecommerce.Store.modal.CartItem;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.repository.CartItemRepository;
import com.tuanvn.Ecommerce.Store.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception {
        CartItem item = findCartItemById(id);
        User cartItemUser = item.getCart().getUser();
        if(cartItemUser.getId().equals(userId)){

            item.setQuantity(cartItem.getQuantity());
            item.setPrice(item.getQuantity() * item.getProduct().getPrice());
            item.setSellingPrice(item.getQuantity() * item.getProduct().getSellingPrice());

            return cartItemRepository.save(item);
        }

        throw new Exception("you can't update this cartItem");
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) throws Exception {
        CartItem item = findCartItemById(cartItemId);
        User cartItemUser = item.getCart().getUser();

        if(cartItemUser.getId().equals(userId)){
            cartItemRepository.delete(item);
        }
        else throw new Exception("you can't delete item");
    }

    @Override
    public CartItem findCartItemById(Long id) throws Exception {
        return cartItemRepository.findById(id).orElseThrow(() ->
                new Exception("cart item not found with id" + id));
    }
}
