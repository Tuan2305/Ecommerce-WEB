package com.tuanvn.Ecommerce.Store.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.checkout.Session;
import com.tuanvn.Ecommerce.Store.config.StripeConfig;
import com.tuanvn.Ecommerce.Store.domain.PaymentMethod;
import com.tuanvn.Ecommerce.Store.domain.PaymentOrderStatus;
import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.PaymentOrder;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.request.StripeChargeRequest;
import com.tuanvn.Ecommerce.Store.response.ApiResponse;
import com.tuanvn.Ecommerce.Store.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, UserService userService, OrderService orderService, TransactionService transactionService, StripeConfig stripeConfig) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.orderService = orderService;
        this.transactionService = transactionService;
        this.stripeConfig = stripeConfig;
    }

    private final TransactionService transactionService;
    private final StripeConfig stripeConfig;

    /**
     * Lấy thông tin cấu hình Stripe
     */
    @GetMapping("/stripe-config")
    public ResponseEntity<Map<String, Object>> getStripeConfig() {
        Map<String, Object> response = new HashMap<>();
        response.put("publicKey", stripeConfig.getPublicKey());
        response.put("currency", "VND");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Tạo một phiên thanh toán Stripe cho đơn hàng
     */
    @GetMapping("/stripe-checkout")
    public ResponseEntity<?> createStripeCheckout(
            @RequestParam Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.findOrderById(orderId);

        // Kiểm tra quyền sở hữu đơn hàng
        if (!order.getUser().getId().equals(user.getId())) {
            throw new Exception("Order does not belong to authenticated user");
        }

        // Lấy tổng số tiền
        Long amount = (long) order.getTotalPrice();

        // Tạo checkout session URL
        String checkoutUrl = paymentService.createStripeCheckoutSession(user, amount, orderId);

        Map<String, Object> response = new HashMap<>();
        response.put("checkoutUrl", checkoutUrl);
        response.put("amount", amount);
        response.put("orderId", orderId);

        return ResponseEntity.ok(response);
    }

    /**
     * Xử lý thanh toán trực tiếp với Stripe Charge
     */
    @PostMapping("/stripe-charge")
    public ResponseEntity<?> createStripeCharge(
            @RequestBody StripeChargeRequest chargeRequest,
            @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        
        // Nếu không có token, sử dụng token test
        if (chargeRequest.getStripeToken() == null || chargeRequest.getStripeToken().isEmpty()) {
            chargeRequest.setStripeToken("tok_visa"); // Token test cho thanh toán thành công
        }
        
        // Nếu không có email, sử dụng email của người dùng
        if (chargeRequest.getStripeEmail() == null || chargeRequest.getStripeEmail().isEmpty()) {
            chargeRequest.setStripeEmail(user.getEmail());
        }
        
        try {
            Charge charge = paymentService.createStripeCharge(chargeRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", charge.getId());
            response.put("status", charge.getStatus());
            response.put("amount", charge.getAmount());
            response.put("currency", charge.getCurrency());
            response.put("description", charge.getDescription());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setMessage("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Kiểm tra trạng thái phiên thanh toán Stripe
     */
    @GetMapping("/stripe/session/{sessionId}")
    public ResponseEntity<?> checkSessionStatus(@PathVariable String sessionId) {
        try {
            Session session = paymentService.retrieveSession(sessionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", session.getId());
            response.put("status", session.getStatus());
            response.put("paymentStatus", session.getPaymentStatus());
            
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            ApiResponse response = new ApiResponse();
            response.setMessage("Error retrieving session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Xử lý thanh toán thành công từ Stripe
     */
    @GetMapping("/stripe-success")
    public ResponseEntity<String> handleStripeSuccess(
            @RequestParam Long orderId,
            @RequestParam(required = false) String session_id) {

        PaymentOrder paymentOrder = paymentService.getPaymentOrderById(String.valueOf(orderId));
        if (paymentOrder != null) {
            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentService.proceedPaymentOrder(paymentOrder, session_id, session_id);
        }

        String redirectUrl = "http://localhost:3000/payment/success?orderId=" + orderId;
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", redirectUrl)
                .build();
    }
    /**
     * Lấy thông tin chi tiết đơn hàng Stripe
     */
    @GetMapping("/stripe-order/{orderId}")
    public ResponseEntity<?> getStripeOrderDetails(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.findOrderById(orderId);

        // Kiểm tra quyền sở hữu đơn hàng
        if (!order.getUser().getId().equals(user.getId())) {
            ApiResponse errorResponse = new ApiResponse();
            errorResponse.setMessage("Order does not belong to authenticated user");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }

        PaymentOrder paymentOrder = paymentService.getPaymentOrderById(String.valueOf(orderId));
        if (paymentOrder == null) {
            ApiResponse errorResponse = new ApiResponse();
            errorResponse.setMessage("Payment order not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        // Lấy thông tin phiên Stripe nếu có
        Session stripeSession = null;
        String sessionId = paymentOrder.getPaymentLinkId();
        if (sessionId != null && paymentOrder.getPaymentMethod() == PaymentMethod.STRIPE) {
            try {
                stripeSession = paymentService.retrieveSession(sessionId);
            } catch (StripeException e) {
                // Không cần xử lý lỗi vì có thể sessionId không còn hợp lệ
                System.out.println("Failed to retrieve Stripe session: " + e.getMessage());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("order", order);
        response.put("paymentDetails", order.getPaymentDetails());
        response.put("orderStatus", order.getOrderStatus());
        response.put("shippingAddress", order.getShippingAddress());
        response.put("orderItems", order.getOrderItems());
        response.put("paymentOrder", paymentOrder);

        if (stripeSession != null) {
            Map<String, Object> stripeDetails = new HashMap<>();
            stripeDetails.put("sessionId", stripeSession.getId());
            stripeDetails.put("paymentStatus", stripeSession.getPaymentStatus());
            stripeDetails.put("status", stripeSession.getStatus());
            stripeDetails.put("amountTotal", stripeSession.getAmountTotal());
            stripeDetails.put("currency", stripeSession.getCurrency());
            response.put("stripeDetails", stripeDetails);
        }

        return ResponseEntity.ok(response);
    }


    /**
     * Xử lý hủy thanh toán từ Stripe
     */
    @GetMapping("/stripe-cancel")
    public ResponseEntity<String> handleStripeCancel(@RequestParam Long orderId) {
        String redirectUrl = "http://localhost:3000/payment/cancel?orderId=" + orderId;
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", redirectUrl)
                .build();
    }

    /**
     * Xử lý Stripe webhook
     */
    @PostMapping("/stripe-webhook")
    public ResponseEntity<ApiResponse> handleStripeWebhook(
            HttpServletRequest request,
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        ApiResponse response = new ApiResponse();

        try {
            boolean processed = paymentService.handleStripeWebhook(payload, sigHeader);

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
     * Kiểm tra trạng thái thanh toán của đơn hàng
     */
    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> checkPaymentStatus(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.findOrderById(orderId);
        
        // Kiểm tra quyền sở hữu đơn hàng
        if (!order.getUser().getId().equals(user.getId())) {
            ApiResponse errorResponse = new ApiResponse();
            errorResponse.setMessage("Order does not belong to authenticated user");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }
        
        PaymentOrder paymentOrder = paymentService.getPaymentOrderById(String.valueOf(orderId));
        if (paymentOrder == null) {
            ApiResponse errorResponse = new ApiResponse();
            errorResponse.setMessage("Payment order not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("status", paymentOrder.getStatus());
        response.put("paymentMethod", paymentOrder.getPaymentMethod());
        response.put("amount", paymentOrder.getAmount());
        
        return ResponseEntity.ok(response);
    }
}