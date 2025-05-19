package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.exceptions.ProductException;
import com.tuanvn.Ecommerce.Store.modal.Product;
import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.request.CreateProductRequest;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;


import java.util.List;

public interface ProductService {

    public Product createProduct(CreateProductRequest req, Seller seller);
    public void deleteProduct(Long productId) throws ProductException;
    public Product updateProduct(Long productId, Product product) throws ProductException;
    Product findProductById(Long productId) throws ProductException;

    List<Product> searchProducts(String query);

    Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber
    );

//    Page<Product> getAllProduct(String category, String brand, String colors, String sizes, Integer minPrice, Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber);

    List<Product> getProductBySellerId(Long sellerId);




}
