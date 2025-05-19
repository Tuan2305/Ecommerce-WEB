package com.tuanvn.Ecommerce.Store.repository;

import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
