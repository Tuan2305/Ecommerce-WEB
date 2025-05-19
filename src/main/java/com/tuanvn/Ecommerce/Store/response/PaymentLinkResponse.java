package com.tuanvn.Ecommerce.Store.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentLinkResponse {
    private String payment_link_url;
    private String payment_link_id;

    public String getPayment_link_id() {
        return payment_link_id;
    }

    public String getPayment_link_url() {
        return payment_link_url;
    }

    public void setPayment_link_url(String payment_link_url) {
        this.payment_link_url = payment_link_url;
    }

    public void setPayment_link_id(String s) {
    }
}
