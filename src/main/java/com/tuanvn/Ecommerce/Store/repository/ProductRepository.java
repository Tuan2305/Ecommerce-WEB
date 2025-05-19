package com.tuanvn.Ecommerce.Store.repository;

import com.tuanvn.Ecommerce.Store.modal.Product;
import org.hibernate.annotations.processing.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long>,
        JpaSpecificationExecutor<Product> {
    List<Product> findBySellerId(Long id);

    @Query("SELECT p FROM Product p where (:query is null or lower(p.title) " +
            "LIKE lower(concat('%', :query, '%'))) " +
            "OR (:query is null or lower(p.category.name) " +
            "LIKE lower(concat('%', :query, '%'))) ")
    List<Product> searchProduct(@Param("query") String query);


//    Page<Product> findAll(Specification<Product> , Pageable );
}
