package com.tuanvn.Ecommerce.Store.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentLinkResponse {
    private String payment_link_url;
    private String payment_link_id;
    private Long amount;
    
    // Thêm các trường mới
    private Long orderId;           // ID của Order chính
    private Long paymentOrderId;    // ID của PaymentOrder
    private List<Long> allOrderIds; // Danh sách tất cả Order IDs (nếu có nhiều seller)

    // Getters và setters
    public String getPayment_link_id() {
        return payment_link_id;
    }

    public void setPayment_link_id(String payment_link_id) {
        this.payment_link_id = payment_link_id;
    }

    public String getPayment_link_url() {
        return payment_link_url;
    }

    public void setPayment_link_url(String payment_link_url) {
        this.payment_link_url = payment_link_url;
    }
    
    public Long getAmount() {
        return amount;
    }
    
    public void setAmount(Long amount) {
        this.amount = amount;
    }

    // Thêm getter/setter cho orderId
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    // Thêm getter/setter cho paymentOrderId
    public Long getPaymentOrderId() {
        return paymentOrderId;
    }

    public void setPaymentOrderId(Long paymentOrderId) {
        this.paymentOrderId = paymentOrderId;
    }

    // Getter/setter cho allOrderIds (tùy chọn)
    public List<Long> getAllOrderIds() {
        return allOrderIds;
    }

    public void setAllOrderIds(List<Long> allOrderIds) {
        this.allOrderIds = allOrderIds;
    }
}