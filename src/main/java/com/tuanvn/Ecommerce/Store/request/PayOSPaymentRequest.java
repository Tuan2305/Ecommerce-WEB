package com.tuanvn.Ecommerce.Store.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayOSPaymentRequest {
    private long orderCode;
    private long amount;
    private String description;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    private String buyerAddress;
    private List<PaymentItem> items;
    private String cancelUrl;
    private String returnUrl;

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public long getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(long orderCode) {
        this.orderCode = orderCode;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public String getBuyerEmail() {
        return buyerEmail;
    }

    public void setBuyerEmail(String buyerEmail) {
        this.buyerEmail = buyerEmail;
    }

    public String getBuyerPhone() {
        return buyerPhone;
    }

    public void setBuyerPhone(String buyerPhone) {
        this.buyerPhone = buyerPhone;
    }

    public List<PaymentItem> getItems() {
        return items;
    }

    public void setItems(List<PaymentItem> items) {
        this.items = items;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }

    public Long getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(Long expiredAt) {
        this.expiredAt = expiredAt;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getBuyerAddress() {
        return buyerAddress;
    }

    public void setBuyerAddress(String buyerAddress) {
        this.buyerAddress = buyerAddress;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    private Long expiredAt;
    private String signature;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentItem {
        private String name;
        private long price;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public long getPrice() {
            return price;
        }

        public void setPrice(long price) {
            this.price = price;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        private int quantity;
    }

    public static PayOSPaymentRequestBuilder customBuilder() {
        return new PayOSPaymentRequestBuilder();
    }

    public static class PayOSPaymentRequestBuilder {
        private PayOSPaymentRequest request = new PayOSPaymentRequest();

        public PayOSPaymentRequestBuilder orderCode(long orderCode) {
            request.setOrderCode(orderCode);
            return this;
        }

        public PayOSPaymentRequestBuilder amount(long amount) {
            request.setAmount(amount);
            return this;
        }

        public PayOSPaymentRequestBuilder description(String description) {
            request.setDescription(description);
            return this;
        }

        public PayOSPaymentRequestBuilder buyerName(String buyerName) {
            request.setBuyerName(buyerName);
            return this;
        }

        public PayOSPaymentRequestBuilder buyerEmail(String buyerEmail) {
            request.setBuyerEmail(buyerEmail);
            return this;
        }

        public PayOSPaymentRequestBuilder buyerPhone(String buyerPhone) {
            request.setBuyerPhone(buyerPhone);
            return this;
        }

        public PayOSPaymentRequestBuilder buyerAddress(String buyerAddress) {
            request.setBuyerAddress(buyerAddress);
            return this;
        }

        public PayOSPaymentRequestBuilder items(List<PaymentItem> items) {
            request.setItems(items);
            return this;
        }

        public PayOSPaymentRequestBuilder cancelUrl(String cancelUrl) {
            request.setCancelUrl(cancelUrl);
            return this;
        }

        public PayOSPaymentRequestBuilder returnUrl(String returnUrl) {
            request.setReturnUrl(returnUrl);
            return this;
        }

        public PayOSPaymentRequestBuilder expiredAt(Long expiredAt) {
            request.setExpiredAt(expiredAt);
            return this;
        }

        public PayOSPaymentRequestBuilder signature(String signature) {
            request.setSignature(signature);
            return this;
        }

        public PayOSPaymentRequest build() {
            return request;
        }
    }
}