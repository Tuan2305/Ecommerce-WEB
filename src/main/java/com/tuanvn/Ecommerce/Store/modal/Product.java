    package com.tuanvn.Ecommerce.Store.modal;


    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;
    import java.util.Locale;

    @Entity
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    //@EqualsAndHashCode
    public class Product {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String title;

        private String description;

        private int price;

        private int sellingPrice;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public int getPrice() {
            return price;
        }

        public void setPrice(int price) {
            this.price = price;
        }

        public int getSellingPrice() {
            return sellingPrice;
        }

        public void setSellingPrice(int sellingPrice) {
            this.sellingPrice = sellingPrice;
        }

        public int getDiscountPercent() {
            return discountPercent;
        }

        public void setDiscountPercent(int discountPercent) {
            this.discountPercent = discountPercent;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public int getNumRatings() {
            return numRatings;
        }

        public void setNumRatings(int numRatings) {
            this.numRatings = numRatings;
        }

        public List<String> getImages() {
            return images;
        }

        public void setImages(List<String> images) {
            this.images = images;
        }

        public Category getCategory() {
            return category;
        }

        public void setCategory(Category category) {
            this.category = category;
        }

        public Seller getSeller() {
            return seller;
        }

        public void setSeller(Seller seller) {
            this.seller = seller;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public String getSizes() {
            return Sizes;
        }

        public void setSizes(String sizes) {
            Sizes = sizes;
        }

        public List<Review> getReviews() {
            return reviews;
        }

        public void setReviews(List<Review> reviews) {
            this.reviews = reviews;
        }

        private int discountPercent;

        private int quantity;

        private String color;

        @ElementCollection
        private List<String> images = new ArrayList<>();

        private int numRatings;

        @ManyToOne
        private Category category;

        @ManyToOne
        private Seller seller;

        private LocalDateTime createdAt;

        private String Sizes;

        @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Review> reviews = new ArrayList<>();
    }