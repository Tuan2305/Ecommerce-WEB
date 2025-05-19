package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.modal.Product;
import com.tuanvn.Ecommerce.Store.modal.Review;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.repository.ReviewRepository;
import com.tuanvn.Ecommerce.Store.request.CreateReviewRequest;
import com.tuanvn.Ecommerce.Store.response.ApiResponse;
import com.tuanvn.Ecommerce.Store.service.ProductService;
import com.tuanvn.Ecommerce.Store.service.ReviewService;
import com.tuanvn.Ecommerce.Store.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    public ReviewController(ReviewService reviewService, UserService userService, ProductService productService) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.productService = productService;
    }

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewByProductId(
            @PathVariable Long productId
    ){
        List<Review> reviews = reviewService.getReviewByProductId (productId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review>writeReview(
            @RequestBody
            CreateReviewRequest req,
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Product product = productService.findProductById(productId);
        Review review = reviewService.createReview(
                req, user, product
        );
        return ResponseEntity.ok(review);
    }

    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @RequestBody CreateReviewRequest req,
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt)
            throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Review review = reviewService.updateReview(
                reviewId,
                req.getReviewText(),
                req.getReviewRating(),
                user.getId()
        );
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        reviewService.deleteReview(reviewId, user.getId());
        ApiResponse res = new ApiResponse();
        res.setMessage("Review deleted successfully");
        return ResponseEntity.ok(res);
    }

}
