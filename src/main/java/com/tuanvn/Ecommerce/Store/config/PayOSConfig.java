package com.tuanvn.Ecommerce.Store.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PayOSConfig {

    @Value("${payos.clientId}")
    private String clientId;

    @Value("${payos.apiKey}")
    private String apiKey;

    @Value("${payos.checksumKey}")
    private String checksumKey;

    @Value("${payos.baseUrl}")
    private String baseUrl;

    @Value("${app.baseUrl}")
    private String appBaseUrl;

    // Getters
    public String getClientId() {
        return clientId;
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getChecksumKey() {
        return checksumKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public String getAppBaseUrl() {
        return appBaseUrl;
    }
}