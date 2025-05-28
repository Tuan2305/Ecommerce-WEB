package com.tuanvn.Ecommerce.Store.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;

import com.tuanvn.Ecommerce.Store.request.StripeChargeRequest;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuanvn.Ecommerce.Store.config.PayOSConfig;
import com.tuanvn.Ecommerce.Store.domain.PaymentMethod;
import com.tuanvn.Ecommerce.Store.domain.PaymentOrderStatus;
import com.tuanvn.Ecommerce.Store.domain.PaymentStatus;
import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.PaymentOrder;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.repository.OrderRepository;
import com.tuanvn.Ecommerce.Store.repository.PaymentOrderRepository;
import com.tuanvn.Ecommerce.Store.request.PayOSPaymentRequest;
import com.tuanvn.Ecommerce.Store.response.PayOSPaymentResponse;
import com.tuanvn.Ecommerce.Store.service.PaymentService;
import com.tuanvn.Ecommerce.Store.utils.PayOSUtils;
import java.util.HashMap;
// import javax.annotation.PostConstruct;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.tuanvn.Ecommerce.Store.config.StripeConfig;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentOrderRepository paymentOrderRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PayOSConfig payOSConfig;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private StripeConfig stripeConfig;

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = stripeConfig.getSecretKey();
    }

   @Override
public PaymentOrder createOrder(User user, Set<Order> orders, PaymentMethod paymentMethod) {
    // Tạo mới PaymentOrder, KHÔNG dùng lại PaymentOrder cũ
    PaymentOrder paymentOrder = new PaymentOrder();
    paymentOrder.setUser(user);
    
    // Xóa tất cả các orders cũ và chỉ thêm orders hiện tại
    // LƯU Ý: KHÔNG sử dụng paymentOrder.getOrders().addAll(orders);
    paymentOrder.setOrders(orders); // Gán trực tiếp orders mới
    
    paymentOrder.setStatus(PaymentOrderStatus.PENDING);
    
    // Tính lại tổng tiền CHỈ từ đơn hàng hiện tại
    double totalAmount = 0;
    System.out.println("Tính tổng tiền cho đơn hàng mới:");
    for (Order order : orders) {
        System.out.println("Đơn hàng ID: " + order.getOrderId() + ", Giá: " + order.getTotalPrice());
        totalAmount += order.getTotalPrice();
    }
    
    // Thêm phí vận chuyển
    double shippingFee = 30000;
    totalAmount += shippingFee;
    
    System.out.println("Tổng tiền đơn hiện tại: " + totalAmount);
    System.out.println("- Giá sản phẩm: " + (totalAmount - shippingFee));
    System.out.println("- Phí vận chuyển: " + shippingFee);
    
    paymentOrder.setAmount((long) totalAmount);
    paymentOrder.setPaymentMethod(paymentMethod != null ? paymentMethod : PaymentMethod.STRIPE);
    
    // Lưu và trả về paymentOrder mới
    return paymentOrderRepository.save(paymentOrder);
}

//    @Override
//    public PaymentOrder createOrder(User user, Set<Order> orders) {
//        return null;
//    }

    @Override
    public PaymentOrder getPaymentOrderById(String orderId) {
        System.out.println("Fetching payment order by ID: " + orderId);
        Long id;
        try {
            id = Long.parseLong(orderId);
        } catch (NumberFormatException e) {
            System.out.println("Invalid order ID: " + orderId);
            return null;
        }

        return paymentOrderRepository.findById(id).orElse(null);
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String paymentId) {
        System.out.println("Fetching payment order by Payment ID: " + paymentId);
        // Implement logic to find payment order by PayOS payment ID
        return paymentOrderRepository.findByPaymentLinkId(paymentId).orElse(null);
    }

    @Override
    public Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) {
        // Kiểm tra các giá trị
        if (paymentOrder == null || paymentId == null || paymentLinkId == null) {
            System.out.println("Payment processing failed due to null values.");
            return false;
        }

        // Cập nhật trạng thái PaymentOrder
        paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
        paymentOrder.setPaymentLinkId(paymentLinkId);
        paymentOrderRepository.save(paymentOrder);

        // Thêm đoạn code này để cập nhật PaymentDetails cho từng Order
        for (Order order : paymentOrder.getOrders()) {
            order.getPaymentDetails().setPaymentId(paymentId);
            order.getPaymentDetails().setPaymentLinkId(paymentLinkId);
            order.getPaymentDetails().setPaymentStatus("PAID");
            order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
            orderRepository.save(order);
        }

        System.out.println("Payment processed successfully for Payment ID: " + paymentId);
        return true;
    }

    @Override
    public PayOSPaymentResponse createPayOSPaymentLink(User user, Long amount, Long orderId) throws Exception {
        System.out.println("Creating PayOS payment link...");

        // Create expiration time (30 minutes from now)
        Long expiredAt = Instant.now().plus(30, ChronoUnit.MINUTES).getEpochSecond();

        // Prepare return and cancel URLs
        String returnUrl = payOSConfig.getAppBaseUrl() + "/api/payment/payos-return?orderId=" + orderId;
        String cancelUrl = payOSConfig.getAppBaseUrl() + "/api/payment/payos-cancel?orderId=" + orderId;

        // Create a short description (max 25 characters)
        String description = "Order #" + (orderId % 10000); // Lấy 4 chữ số cuối

        // Create parameters for signature
        TreeMap<String, String> signParams = new TreeMap<>();
        signParams.put("amount", String.valueOf(amount));
        signParams.put("cancelUrl", cancelUrl);
        signParams.put("description", description);
        signParams.put("orderCode", String.valueOf(orderId));
        signParams.put("returnUrl", returnUrl);

        // Generate signature
        String signature = PayOSUtils.generateSignature(signParams, payOSConfig.getChecksumKey());

        // Create request body
        PayOSPaymentRequest request = PayOSPaymentRequest.customBuilder()
                .orderCode(orderId)
                .amount(amount)
                .description(description) // Sử dụng mô tả ngắn gọn
                .buyerName(user.getFullName())
                .buyerEmail(user.getEmail())
                .buyerPhone(user.getMobile())
                .buyerAddress("")
                .items(new ArrayList<>())
                .cancelUrl(cancelUrl)
                .returnUrl(returnUrl)
                .expiredAt(expiredAt)
                .signature(signature)
                .build();

        // Set up HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-client-id", payOSConfig.getClientId());
        headers.set("x-api-key", payOSConfig.getApiKey());

        // Create HTTP entity
        HttpEntity<PayOSPaymentRequest> entity = new HttpEntity<>(request, headers);

        // Make API call
        ResponseEntity<PayOSPaymentResponse> response = restTemplate.exchange(
                payOSConfig.getBaseUrl() + "/v2/payment-requests",
                HttpMethod.POST,
                entity,
                PayOSPaymentResponse.class
        );

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            PayOSPaymentResponse paymentResponse = response.getBody();
            if ("00".equals(paymentResponse.getCode())) {
                // Update payment order with PayOS payment link ID
                Optional<PaymentOrder> optionalPaymentOrder = paymentOrderRepository.findById(orderId);
                if (optionalPaymentOrder.isPresent()) {
                    PaymentOrder paymentOrder = optionalPaymentOrder.get();
                    paymentOrder.setPaymentLinkId(paymentResponse.getData().getPaymentLinkId());
                    paymentOrderRepository.save(paymentOrder);
                }

                System.out.println("PayOS payment link created successfully: " +
                        paymentResponse.getData().getPaymentUrl());
                return paymentResponse;
            } else {
                System.out.println("Failed to create PayOS payment link: " + paymentResponse.getDesc());
                throw new Exception("Failed to create PayOS payment: " + paymentResponse.getDesc());
            }
        } else {
            System.out.println("Failed to create PayOS payment link: " + response.getStatusCode());
            throw new Exception("Failed to create PayOS payment: " + response.getStatusCode());
        }
    }

    @Override
    public boolean handlePayOSWebhook(String paymentData, String signature) throws Exception {
        // Verify signature
        if (!PayOSUtils.verifySignature(paymentData, signature, payOSConfig.getChecksumKey())) {
            System.out.println("Invalid PayOS webhook signature");
            return false;
        }

        // Parse webhook data
        Map<String, Object> webhookData = objectMapper.readValue(paymentData, Map.class);

        // Get payment details
        String paymentId = webhookData.get("paymentId").toString();
        String paymentLinkId = webhookData.get("paymentLinkId").toString();
        String status = webhookData.get("status").toString();

        // Find payment order
        PaymentOrder paymentOrder = getPaymentOrderByPaymentId(paymentLinkId);
        if (paymentOrder == null) {
            System.out.println("Payment order not found for paymentLinkId: " + paymentLinkId);
            return false;
        }

        // Process payment status
        if ("PAID".equals(status)) {
            return proceedPaymentOrder(paymentOrder, paymentId, paymentLinkId);
        } else if ("CANCELLED".equals(status)) {
            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrderRepository.save(paymentOrder);
            System.out.println("Payment cancelled for paymentLinkId: " + paymentLinkId);
            return true;
        } else {
            System.out.println("Unhandled payment status: " + status);
            return false;
        }
    }

    @Override
    public String createStripeCheckoutSession(User user, Long amount, Long orderId) throws Exception {
        String successUrl = "http://localhost:3000/payment/stripe-success?orderId=" + orderId;
        String cancelUrl = "http://localhost:3000/payment/stripe-cancel?orderId=" + orderId;

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("VND")
                                    .setUnitAmount(amount)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Order #" + orderId)
                                            .setDescription("Payment for order #" + orderId)
                                            .build())
                                    .build())
                            .build())
                    .build();

            Session session = Session.create(params);

            // Update payment order with session ID
            Optional<PaymentOrder> optionalPaymentOrder = paymentOrderRepository.findById(orderId);
            if (optionalPaymentOrder.isPresent()) {
                PaymentOrder paymentOrder = optionalPaymentOrder.get();
                paymentOrder.setPaymentLinkId(session.getId());
                paymentOrderRepository.save(paymentOrder);
            }

            return session.getUrl();
        } catch (StripeException e) {
            throw new Exception("Error creating Stripe checkout session: " + e.getMessage());
        }
    }

    @Override
    public Charge createStripeCharge(StripeChargeRequest chargeRequest) throws StripeException {
        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", chargeRequest.getAmount());
        chargeParams.put("currency", chargeRequest.getCurrency());
        chargeParams.put("description", chargeRequest.getDescription());
        chargeParams.put("source", chargeRequest.getStripeToken());

        return Charge.create(chargeParams);
    }

    @Override
    public Session retrieveSession(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }

    @Override
    public boolean handleStripeWebhook(String payload, String sigHeader) throws Exception {
        // Simple implementation
        try {
            // In a real implementation, you would verify the webhook signature
            // and process the payment event
            return true;
        } catch (Exception e) {
            throw new Exception("Error processing webhook: " + e.getMessage());
        }
    }
}