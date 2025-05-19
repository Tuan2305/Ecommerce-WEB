package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.Product;
import com.tuanvn.Ecommerce.Store.modal.Review;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.repository.CartRepository;
import com.tuanvn.Ecommerce.Store.request.CreateReviewRequest;

import java.util.List;

public interface ReviewService {
    Review createReview(CreateReviewRequest req, User user, Product product);
    List<Review> getReviewByProductId(Long productId);

    Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception;

    void deleteReview(Long reviewId, Long userId) throws Exception;

    Review getReviewById(Long reviewId) throws Exception;

}
