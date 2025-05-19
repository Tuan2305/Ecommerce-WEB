package com.tuanvn.Ecommerce.Store.modal;

import com.tuanvn.Ecommerce.Store.domain.PaymentMethod;
import com.tuanvn.Ecommerce.Store.domain.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String paymentId;         // Payment ID from PayOS
    private String paymentLinkId;     // Payment link ID from PayOS
    private Long amount;              // Transaction amount
    private String description;       // Payment description
    private PaymentStatus status;     // PENDING, COMPLETED, FAILED, CANCELLED
    private PaymentMethod paymentMethod = PaymentMethod.PAYOS;  // Default to PAYOS

    // Transaction details
    private String transactionReference; // Reference for the transaction
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    // Buyer information
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;

    // Order information
    @OneToOne
    private Order order;

    @ManyToOne
    private User user;

    // PayOS specific fields
    private String signature;     // Signature for verification

    // Additional details
    @Column(length = 1000)
    private String rawResponse;   // Store the raw API response for reference
    private String errorCode;     // Error code if payment failed
    private String errorMessage;  // Error message if payment failed

    // Getters and setters (Lombok takes care of these with @Getter and @Setter)

    // Utility methods
    public boolean isCompleted() {
        return PaymentStatus.COMPLETED.equals(status);
    }

    public boolean isFailed() {
        return PaymentStatus.FAILED.equals(status);
    }

    public boolean isCancelled() {
        return PaymentStatus.CANCELLED.equals(status);
    }

    public boolean isPending() {
        return PaymentStatus.PENDING.equals(status);
    }

    public void markAsCompleted() {
        this.status = PaymentStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsFailed(String errorCode, String errorMessage) {
        this.status = PaymentStatus.FAILED;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsCancelled() {
        this.status = PaymentStatus.CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }

    // For internal tracking
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}