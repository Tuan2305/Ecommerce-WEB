package com.tuanvn.Ecommerce.Store.repository;

import com.tuanvn.Ecommerce.Store.modal.Order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);
    List<Order> findBySellerId(Long sellerId);

}
