package com.tuanvn.Ecommerce.Store.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.TreeMap;

public class PayOSUtils {

    public static String generateSignature(TreeMap<String, String> params, String checksumKey) throws Exception {
        StringBuilder dataToSign = new StringBuilder();

        // Sort parameters by key and build the data string
        for (String key : params.keySet()) {
            if (dataToSign.length() > 0) {
                dataToSign.append("&");
            }
            dataToSign.append(key).append("=").append(params.get(key));
        }

        String data = dataToSign.toString();

        // Create HMAC-SHA256 signature
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(checksumKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);
        byte[] hashBytes = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hashBytes);
    }

    public static boolean verifySignature(String data, String signature, String checksumKey) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(checksumKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);
        byte[] hashBytes = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        String calculatedSignature = bytesToHex(hashBytes);
        return calculatedSignature.equals(signature);
    }

    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}