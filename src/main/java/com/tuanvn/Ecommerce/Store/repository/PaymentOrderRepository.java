package com.tuanvn.Ecommerce.Store.repository;

import com.tuanvn.Ecommerce.Store.domain.PaymentOrderStatus;
import com.tuanvn.Ecommerce.Store.modal.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
    // Find all PaymentOrders by user ID
    @Query("SELECT p FROM PaymentOrder p WHERE p.user.id = :userId")
    List<PaymentOrder> findAllByUserId(@Param("userId") Long userId);

    // Find all PaymentOrders with a specific status
    List<PaymentOrder> findByStatus(PaymentOrderStatus status);

    // Find PaymentOrder by payment link ID
    Optional<PaymentOrder> findByPaymentLinkId(String paymentLinkId);
}