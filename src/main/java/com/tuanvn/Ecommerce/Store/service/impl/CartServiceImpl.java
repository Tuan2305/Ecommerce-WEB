package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.*;
import com.tuanvn.Ecommerce.Store.repository.CartItemRepository;
import com.tuanvn.Ecommerce.Store.repository.CartRepository;
import com.tuanvn.Ecommerce.Store.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    Cart cart = findUserCart(user);
    CartItem isPresent = cartItemRepository.findByCartAndProductAndSize(cart, product, size);

    if(isPresent == null){
        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        cartItem.setUserId(user.getId());
        cartItem.setSize(size);
        
        // Lưu giá đơn vị của sản phẩm * số lượng
        int itemTotal = product.getPrice() * quantity;
        cartItem.setPrice(itemTotal);
        
        // Giá bán cuối cùng (có thể giảm giá)
        int sellingTotal = product.getSellingPrice() * quantity;
        cartItem.setSellingPrice(sellingTotal);
        
        cart.getCartItems().add(cartItem);
        cartItem.setCart(cart);
        
        System.out.println("Thêm sản phẩm: " + product.getTitle() + 
                         ", Đơn giá: " + product.getPrice() + 
                         ", Số lượng: " + quantity + 
                         ", Thành tiền: " + itemTotal);
        
        return cartItemRepository.save(cartItem);
    }
    
    // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng và giá
    int newQuantity = isPresent.getQuantity() + quantity;
    isPresent.setQuantity(newQuantity);
    
    // Cập nhật giá dựa trên số lượng mới
    isPresent.setPrice(product.getPrice() * newQuantity);
    isPresent.setSellingPrice(product.getSellingPrice() * newQuantity);
    
    System.out.println("Cập nhật sản phẩm: " + product.getTitle() + 
                     ", Đơn giá: " + product.getPrice() + 
                     ", Số lượng mới: " + newQuantity + 
                     ", Thành tiền mới: " + (product.getPrice() * newQuantity));
    
    return cartItemRepository.save(isPresent);
}


    @Override
    public Cart findUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());
        
        // Reset calculations to ensure clean totals
        int totalPrice = 0;
        int totalItem = 0;

        // Tính đúng theo logic frontend: đơn giá * số lượng
        for(CartItem cartItem: cart.getCartItems()){
            // Tránh null pointer bằng cách dùng null check
            int itemPrice = cartItem.getProduct().getPrice(); // Lấy đơn giá từ sản phẩm
            int quantity = cartItem.getQuantity();
            
            // Tính tổng giá cho từng mặt hàng (đơn giá * số lượng)
            int itemTotal = itemPrice * quantity;
            
            // Cập nhật cartItem với giá đã tính
            cartItem.setPrice(itemTotal);
            
            // Cộng dồn vào tổng giỏ hàng
            totalPrice += itemTotal;
            totalItem += quantity;
            
            System.out.println("Cart item: " + cartItem.getProduct().getTitle() + 
                            ", Đơn giá: " + itemPrice + 
                            ", Số lượng: " + quantity + 
                            ", Thành tiền: " + itemTotal);
        }
        
        // Cập nhật tổng của giỏ hàng
        cart.setTotalPrice(totalPrice);
        cart.setTotalItem(totalItem);
        
        System.out.println("Tổng giỏ hàng (chưa phí ship): " + totalPrice);
        
        return cart;
    }

    @Override
    public void clearCartAfterOrder(User user, Set<Order> orders) {
        Cart cart = cartRepository.findByUserId(user.getId());

        // Xác định các sản phẩm đã được đặt hàng
        Set<Long> orderedProductIds = new HashSet<>();
        for (Order order : orders) {
            for (OrderItem orderItem : order.getOrderItems()) {
                orderedProductIds.add(orderItem.getProduct().getId());
            }
        }

        // Xóa các CartItem tương ứng
        List<CartItem> itemsToRemove = cart.getCartItems().stream()
                .filter(item -> orderedProductIds.contains(item.getProduct().getId()))
                .collect(Collectors.toList());

        for (CartItem item : itemsToRemove) {
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        }

        // Cập nhật lại tổng giá giỏ hàng
        int totalPrice = 0;
        int totalItem = 0;

        for (CartItem cartItem : cart.getCartItems()) {
            totalPrice += cartItem.getPrice();
            totalItem += cartItem.getQuantity();
        }

        cart.setTotalPrice(totalPrice);
        cart.setTotalItem(totalItem);

        cartRepository.save(cart);
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
