package com.tuanvn.Ecommerce.Store.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.checkout.Session;
import com.tuanvn.Ecommerce.Store.domain.PaymentMethod;
import com.tuanvn.Ecommerce.Store.response.PayOSPaymentResponse;
import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.PaymentOrder;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.request.StripeChargeRequest;

import java.util.Set;

public interface PaymentService {
    PaymentOrder createOrder(User user, Set<Order> orders, PaymentMethod paymentMethod);
    PaymentOrder getPaymentOrderById(String orderId);
    PaymentOrder getPaymentOrderByPaymentId(String paymentId);
    Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId);

    // New PayOS methods
    PayOSPaymentResponse createPayOSPaymentLink(User user, Long amount, Long orderId) throws Exception;
    boolean handlePayOSWebhook(String paymentData, String signature) throws Exception;
    
    // Stripe methods (đang thiếu)
    String createStripeCheckoutSession(User user, Long amount, Long orderId) throws Exception;
    Charge createStripeCharge(StripeChargeRequest chargeRequest) throws StripeException;
    Session retrieveSession(String sessionId) throws StripeException;
    boolean handleStripeWebhook(String payload, String sigHeader) throws Exception;
}