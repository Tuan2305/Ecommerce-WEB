package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.response.PayOSPaymentResponse;
import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.PaymentOrder;
import com.tuanvn.Ecommerce.Store.modal.User;

import java.util.Set;

public interface PaymentService {
    PaymentOrder createOrder(User user, Set<Order> orders);
    PaymentOrder getPaymentOrderById(String orderId);
    PaymentOrder getPaymentOrderByPaymentId(String paymentId);
    Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId);

    // New PayOS methods
    PayOSPaymentResponse createPayOSPaymentLink(User user, Long amount, Long orderId) throws Exception;
    boolean handlePayOSWebhook(String paymentData, String signature) throws Exception;
}