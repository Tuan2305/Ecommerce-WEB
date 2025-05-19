package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.domain.PaymentOrderStatus;
import com.tuanvn.Ecommerce.Store.response.PayOSPaymentResponse;
import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.PaymentOrder;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.response.ApiResponse;
import com.tuanvn.Ecommerce.Store.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final OrderService orderService;
    private final TransactionService transactionService;

    public PaymentController(PaymentService paymentService, UserService userService, OrderService orderService, TransactionService transactionService) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.orderService = orderService;
        this.transactionService = transactionService;
    }

    /**
     * Endpoint to create a PayOS payment link for an order.
     * @param orderId The ID of the order to be paid.
     * @param jwt The authorization token of the user.
     * @return The PayOS payment response containing the payment URL.
     * @throws Exception If an error occurs while generating the payment URL.
     */
    @GetMapping("/payos")
    public ResponseEntity<PayOSPaymentResponse> createPayOSPayment(
            @RequestParam Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.findOrderById(orderId);

        // Validate that the order belongs to the user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new Exception("Order does not belong to authenticated user");
        }

        // Get amount
        Long amount = (long) order.getTotalPrice();

        // Create PayOS payment link
        PayOSPaymentResponse response = paymentService.createPayOSPaymentLink(user, amount, orderId);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to process the return from PayOS after payment.
     * @param orderId The ID of the order.
     * @param paymentId The payment ID from PayOS.
     * @param status The status of the payment.
     * @return A redirect to the frontend success or cancel page.
     */
    @GetMapping("/payos-return")
    public ResponseEntity<String> processPayOSReturn(
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) String paymentId,
            @RequestParam(required = false) String status) {

        String redirectUrl;

        if ("PAID".equals(status)) {
            redirectUrl = "http://localhost:3000/payment/success?orderId=" + orderId;
        } else {
            redirectUrl = "http://localhost:3000/payment/cancel?orderId=" + orderId;
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", redirectUrl)
                .build();
    }

    /**
     * Endpoint to handle PayOS webhook for payment notifications.
     * @param request The HTTP request containing the webhook data.
     * @return A response indicating success or failure of webhook processing.
     */
    @PostMapping("/payos-webhook")
    public ResponseEntity<ApiResponse> handlePayOSWebhook(
            HttpServletRequest request,
            @RequestBody Map<String, Object> webhookData,
            @RequestHeader("Signature") String signature) {

        ApiResponse response = new ApiResponse();

        try {
            String paymentData = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);

            boolean processed = paymentService.handlePayOSWebhook(paymentData, signature);

            if (processed) {
                response.setMessage("Webhook processed successfully");
                return ResponseEntity.ok(response);
            } else {
                response.setMessage("Failed to process webhook");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            response.setMessage("Error processing webhook: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint to handle payment cancellation from PayOS.
     * @param orderId The ID of the order that was cancelled.
     * @return A response indicating the cancellation status.
     */
    @GetMapping("/payos-cancel")
    public ResponseEntity<String> handlePayOSCancel(@RequestParam Long orderId) {
        String redirectUrl = "http://localhost:3000/payment/cancel?orderId=" + orderId;

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", redirectUrl)
                .build();
    }

    @PostMapping("/test-payos")
    public ResponseEntity<?> testPayOSPayment(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Map<String, Object> testData) throws Exception {

        // Get authenticated user
        User user = userService.findUserByJwtToken(jwt);

        // Extract test parameters
        Long amount = Long.valueOf(testData.getOrDefault("amount", 10000).toString());

        // Đảm bảo description không vượt quá 25 ký tự
        String description = testData.getOrDefault("description", "Test payment").toString();
        if (description.length() > 25) {
            description = description.substring(0, 25);
        }

        // Create a temporary order ID for testing
        Long tempOrderId = System.currentTimeMillis();

        // Generate PayOS payment link
        PayOSPaymentResponse paymentResponse = paymentService.createPayOSPaymentLink(user, amount, tempOrderId);

        // Prepare response with payment details
    Map<String, Object> response = new HashMap<>();
    response.put("testOrderId", tempOrderId);
    response.put("amount", amount);
    response.put("description", description);
    response.put("paymentUrl", paymentResponse.getData().getPaymentUrl());
    response.put("paymentLinkId", paymentResponse.getData().getPaymentLinkId());
    response.put("userDetails", Map.of(
        "name", user.getFullName(),
        "email", user.getEmail(),
        "phone", user.getMobile()
    ));
    response.put("instructions", "Open the paymentUrl in browser to proceed with test payment");
    
    return ResponseEntity.ok(response);
}

/**
 * Endpoint to check status of a test payment
 */
@GetMapping("/test-payos/status/{paymentLinkId}")
public ResponseEntity<?> checkTestPaymentStatus(
        @PathVariable String paymentLinkId,
        @RequestHeader("Authorization") String jwt) throws Exception {
    
    // Get payment order by payment link ID
    PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentLinkId);
    
    Map<String, Object> response = new HashMap<>();
    response.put("paymentLinkId", paymentLinkId);
    
    if (paymentOrder != null) {
        response.put("status", paymentOrder.getStatus());
        response.put("paymentMethod", paymentOrder.getPaymentMethod());
        response.put("amount", paymentOrder.getAmount());
    } else {
        response.put("status", "UNKNOWN");
        response.put("message", "Payment not found or not completed yet");
    }
    
    return ResponseEntity.ok(response);
}

}