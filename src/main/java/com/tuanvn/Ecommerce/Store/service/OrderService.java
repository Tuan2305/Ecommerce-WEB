package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.domain.OrderStatus;
import com.tuanvn.Ecommerce.Store.modal.*;
import com.tuanvn.Ecommerce.Store.repository.OrderItemRepository;

import java.util.List;
import java.util.Set;

public interface OrderService {
    Set<Order> createOrder(User user,Address shippingAddress ,Cart cart);
    Order findOrderById(Long id) throws Exception;
    List<Order> usersOrderHistory(Long userId);
    List<Order> sellersOrder(Long sellerId);
    Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception;
    Order cancelOrder(Long orderId, User user) throws Exception;
    OrderItem getOrderItemById(Long id) throws Exception;
}
