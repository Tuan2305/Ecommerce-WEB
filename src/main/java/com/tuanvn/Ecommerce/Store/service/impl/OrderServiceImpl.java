package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.domain.OrderStatus;
import com.tuanvn.Ecommerce.Store.domain.PaymentStatus;
import com.tuanvn.Ecommerce.Store.modal.*;
import com.tuanvn.Ecommerce.Store.repository.*;
import com.tuanvn.Ecommerce.Store.request.AddItemRequest;
import com.tuanvn.Ecommerce.Store.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    public OrderServiceImpl(OrderRepository orderRepository, AddressRepository addressRepository, OrderItemRepository orderItemRepository, CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public Set<Order> createOrder(User user, Address shippingAddress, Cart cart) {

        if(!user.getAddresses().contains(shippingAddress)){
            user.getAddresses().add(shippingAddress);
        }
        Address address = addressRepository.save(shippingAddress);

        Map<Long, List<CartItem>> itemBySeller = cart.getCartItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct()
                        .getSeller().getId()));

        Set<Order> orders = new HashSet<>();
        
        // Lấy timestamp hiện tại cho phần chung của orderId
        long timestamp = System.currentTimeMillis();
        int orderCounter = 0; // Số đếm để đảm bảo không trùng ID trong cùng một phiên
        
        for(Map.Entry<Long, List<CartItem>> entry : itemBySeller.entrySet()){
            Long sellerId = entry.getKey();
            List<CartItem> items = entry.getValue();

            int totalOrderPrice = items.stream().mapToInt(
                    CartItem::getSellingPrice
            ).sum();
            int totalItem = items.stream().mapToInt(CartItem::getQuantity).sum();

            Order createdOrder = new Order();
            
            // Tạo orderId duy nhất cho mỗi đơn hàng
            String uniqueOrderId = String.format("ORD-%s-%d-%d-%d", 
                    new SimpleDateFormat("yyyyMMdd").format(new Date()),
                    user.getId(), 
                    sellerId,
                    timestamp + (orderCounter++));  // Đảm bảo không trùng lặp
                    
            createdOrder.setOrderId(uniqueOrderId);
            createdOrder.setUser(user);
            createdOrder.setSellerId(sellerId);
            createdOrder.setTotalPrice(totalOrderPrice);
            createdOrder.setTotalSellingPrice(totalOrderPrice);
            createdOrder.setTotalItem(totalItem);
            createdOrder.setShippingAddress(address);
            createdOrder.setOrderStatus(OrderStatus.PENDING);
            createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);

            Order savedOrder = orderRepository.save(createdOrder);
            orders.add(savedOrder);

            List<OrderItem> orderItems = new ArrayList<>();

            for(CartItem item : items){
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setPrice(item.getPrice());
                orderItem.setProduct(item.getProduct());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setSize(item.getSize());
                orderItem.setUserId(item.getUserId());
                orderItem.setSellingPrice(item.getSellingPrice());

                savedOrder.getOrderItems().add(orderItem);

                OrderItem savedOrderItem = orderItemRepository.save(orderItem);
                orderItems.add(savedOrderItem);
            }
        }

        return orders;
    }

    @Override
    public Order findOrderById(Long id) throws Exception {
        return orderRepository.findById(id).orElseThrow(() ->new Exception("order not found.."));
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> sellersOrder(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);

    }

    @Override
    public Order cancelOrder(Long orderId, User user) throws Exception {
        Order order = findOrderById(orderId);

        if(!user.getId().equals(order.getUser().getId())){
            throw new Exception("you don't have access to this order");
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Override
    public OrderItem getOrderItemById(Long id) throws Exception {
        return orderItemRepository.findById(id).orElseThrow(()->
                new Exception("order item not exits .."));
    }

    @Override
    public Set<Order> createOrderWithSelectedProducts(User user, Address shippingAddress, Cart cart, List<Long> productIds) {
        // Lọc các CartItem theo productIds
        List<CartItem> selectedItems = cart.getCartItems().stream()
                .filter(item -> productIds.contains(item.getProduct().getId()))
                .toList();

        // Tạo một Cart tạm thời chỉ chứa các sản phẩm được chọn
        Cart tempCart = new Cart();
        tempCart.setUser(user);
        tempCart.setCartItems(new HashSet<>(selectedItems));

        // Tính lại tổng giá
        int totalPrice = selectedItems.stream()
                .mapToInt(CartItem::getPrice)
                .sum();
        tempCart.setTotalPrice(totalPrice);

        int totalItems = selectedItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        tempCart.setTotalItem(totalItems);

        // Gọi phương thức createOrder với giỏ hàng tạm thời
        return createOrder(user, shippingAddress, tempCart);
    }

//    @Override
//    public void clearCartAfterOrder(User user, Set<Order> orders) {
//        Cart cart = cartRepository.findByUserId(user.getId());
//
//        // Xác định các sản phẩm đã được đặt hàng
//        Set<Long> orderedProductIds = new HashSet<>();
//        for (Order order : orders) {
//            for (OrderItem orderItem : order.getOrderItems()) {
//                orderedProductIds.add(orderItem.getProduct().getId());
//            }
//        }
//
//        // Xóa các CartItem tương ứng
//        List<CartItem> itemsToRemove = cart.getCartItems().stream()
//                .filter(item -> orderedProductIds.contains(item.getProduct().getId()))
//                .toList();
//
//        for (CartItem item : itemsToRemove) {
//            cart.getCartItems().remove(item);
//            cartItemRepository.delete(item);
//        }
//
//        // Cập nhật lại tổng giá giỏ hàng
//        int totalPrice = 0;
//        int totalItem = 0;
//
//        for (CartItem cartItem : cart.getCartItems()) {
//            totalPrice += cartItem.getPrice();
//            totalItem += cartItem.getQuantity();
//        }
//
//        cart.setTotalPrice(totalPrice);
//        cart.setTotalItem(totalItem);
//
//        cartRepository.save(cart);
//    }


}