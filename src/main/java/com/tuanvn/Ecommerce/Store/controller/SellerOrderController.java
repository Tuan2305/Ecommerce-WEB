package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.domain.OrderStatus;
import com.tuanvn.Ecommerce.Store.exceptions.SellerException;
import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.service.OrderService;
import com.tuanvn.Ecommerce.Store.service.SellerReportService;
import com.tuanvn.Ecommerce.Store.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller/orders")
public class SellerOrderController {
    private final OrderService orderService;
    private final SellerService sellerService;

    public SellerOrderController(OrderService orderService, SellerService sellerService) {
        this.orderService = orderService;
        this.sellerService = sellerService;
    }

    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersHandler(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        Seller seller=sellerService.getSellerProfile (jwt);
        List<Order> orders=orderService.sellersOrder(seller.getId());
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);

    }
    @PatchMapping("/{orderId}/status/{orderStatus}")
    public ResponseEntity<Order> updateOrderHandler(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long orderId,
            @PathVariable OrderStatus orderStatus
    ) throws Exception {
        Order orders=orderService.updateOrderStatus (orderId, orderStatus);
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);

    }

}
