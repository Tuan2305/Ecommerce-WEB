package com.tuanvn.Ecommerce.Store.repository;

import com.tuanvn.Ecommerce.Store.domain.AccountStatus;
import com.tuanvn.Ecommerce.Store.modal.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller,Long> {
    Seller findByEmail(String email);
    List<Seller> findByAccountStatus(AccountStatus status);

}
