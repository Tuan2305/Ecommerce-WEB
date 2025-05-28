package com.tuanvn.Ecommerce.Store.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.secretKey}")
    private String secretKey;

    @Value("${stripe.publicKey}")
    private String publicKey;

    @Value("${app.baseUrl:http://localhost:3000}")
    private String appBaseUrl;

    public String getSecretKey() {
        return secretKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public String getAppBaseUrl() {
        return appBaseUrl;
    }
}