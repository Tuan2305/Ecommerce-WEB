package com.tuanvn.Ecommerce.Store.response;

import com.tuanvn.Ecommerce.Store.modal.PaymentDetails;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PayOSPaymentResponse {
    private String code;
    private String desc;
    private PayOSPaymentData data;
    private String signature;
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public PayOSPaymentData getData() {
        return data;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public void setData(PayOSPaymentData data) {
        this.data = data;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }




    @Data
    @NoArgsConstructor
    public static class PayOSPaymentData {
        private String paymentLinkId;
        private String paymentUrl;
        private String status;

        public String getPaymentLinkId() {
            return paymentLinkId;
        }

        public void setPaymentLinkId(String paymentLinkId) {
            this.paymentLinkId = paymentLinkId;
        }

        public String getPaymentUrl() {
            return paymentUrl;
        }

        public void setPaymentUrl(String paymentUrl) {
            this.paymentUrl = paymentUrl;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        private String description;
    }
}
