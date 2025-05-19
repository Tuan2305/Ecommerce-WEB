package com.tuanvn.Ecommerce.Store.repository;

import com.tuanvn.Ecommerce.Store.modal.Address;
import com.tuanvn.Ecommerce.Store.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
    List<Address> findByUserAndIsDefaultTrue(User user);
}