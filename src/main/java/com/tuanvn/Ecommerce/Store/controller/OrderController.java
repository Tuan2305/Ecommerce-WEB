package com.tuanvn.Ecommerce.Store.controller;


import com.tuanvn.Ecommerce.Store.domain.PaymentMethod;
import com.tuanvn.Ecommerce.Store.modal.*;
import com.tuanvn.Ecommerce.Store.response.PayOSPaymentResponse;
import com.tuanvn.Ecommerce.Store.response.PaymentLinkResponse;
import com.tuanvn.Ecommerce.Store.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final CartService cartService;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final PaymentService paymentService;
    public OrderController(OrderService orderService, UserService userService, CartService cartService, SellerService sellerService, SellerReportService sellerReportService, PaymentService paymentService) {
        this.orderService = orderService;
        this.userService = userService;
        this.cartService = cartService;
        this.sellerService = sellerService;
        this.sellerReportService = sellerReportService;
        this.paymentService = paymentService;
    }

@PostMapping()
public ResponseEntity<PaymentLinkResponse> createOrderHandler(
        @RequestBody Address shippingAddress,
        @RequestParam(name = "productIds", required = false) List<Long> productIds,
        @RequestParam(name = "paymentMethod", required = false, defaultValue = "STRIPE") PaymentMethod paymentMethod,
        @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserByJwtToken(jwt);
    Cart cart = cartService.findUserCart(user);
    
    // Nếu không có sản phẩm nào được chỉ định, sử dụng toàn bộ giỏ hàng
    Set<Order> orders;
    if (productIds != null && !productIds.isEmpty()) {
        orders = orderService.createOrderWithSelectedProducts(user, shippingAddress, cart, productIds);
    } else {
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new Exception("Cart is empty");
        }
        orders = orderService.createOrder(user, shippingAddress, cart);
    }
    
    PaymentOrder paymentOrder = paymentService.createOrder(user, orders, paymentMethod);
    
    // Sau khi đặt hàng thành công, xóa các sản phẩm đã đặt khỏi giỏ hàng
    cartService.clearCartAfterOrder(user, orders);
    
    // Lấy Order ID đầu tiên để trả về
    Long primaryOrderId = null;
    if (!orders.isEmpty()) {
        primaryOrderId = orders.iterator().next().getId();
    }
    
    PaymentLinkResponse res = new PaymentLinkResponse();
    res.setAmount(paymentOrder.getAmount());
    res.setOrderId(primaryOrderId); // Thêm Order ID vào response
    res.setPaymentOrderId(paymentOrder.getId()); // ID của PaymentOrder
    
    // Tạo session thanh toán với Stripe
    String checkoutUrl = paymentService.createStripeCheckoutSession(user, paymentOrder.getAmount(), paymentOrder.getId());
    res.setPayment_link_url(checkoutUrl);
    res.setPayment_link_id(paymentOrder.getPaymentLinkId());

    return new ResponseEntity<>(res, HttpStatus.OK);
}
    @GetMapping("/user")
    public ResponseEntity<List<Order>> usersOrderHistoryHandler(
            @RequestHeader("Authorization")
            String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Order> orders=orderService.usersOrderHistory(user.getId());
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{orderId}")

    public ResponseEntity< Order> getOrderById(@PathVariable Long orderId,@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order orders=orderService.findOrderById(orderId);
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);

    }
    @GetMapping("/item/{orderItemId}")
    public ResponseEntity<OrderItem> getOrderItemById(
            @PathVariable Long orderItemId, @RequestHeader("Authorization")
            String jwt) throws Exception {
        System.out.println("--controller ");
        User user = userService.findUserByJwtToken(jwt) ;
        OrderItem orderItem=orderService.getOrderItemById(orderItemId);
        return new ResponseEntity<>(orderItem, HttpStatus.ACCEPTED);
    }
    @PutMapping("/{orderId}/cancel")

    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.cancelOrder(orderId, user);
//        Seller seller= sellerService.getSellerById(order.getSellerId());
//        SellerReport report=sellerReportService.getSellerReport (seller);
//        report.setCanceledOrders (report.getCanceledOrders()+1);
//        report.setTotalRefunds (report.getTotalRefunds()+order.getTotalSelling Price());
//        sellerReportService.updateSellerReport (report);
        return ResponseEntity.ok(order);
    }


}
