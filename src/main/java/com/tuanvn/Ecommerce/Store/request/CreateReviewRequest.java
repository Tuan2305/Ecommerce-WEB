package com.tuanvn.Ecommerce.Store.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateReviewRequest {

    private String reviewText;
    private double reviewRating;
    private List<String> productImages;

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public double getReviewRating() {
        return reviewRating;
    }

    public void setReviewRating(double reviewRating) {
        this.reviewRating = reviewRating;
    }

    public List<String> getProductImages() {
        return productImages;
    }

    public void setProductImages(List<String> productImages) {
        this.productImages = productImages;
    }
}
