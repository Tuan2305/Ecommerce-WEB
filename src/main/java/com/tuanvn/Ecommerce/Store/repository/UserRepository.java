package com.tuanvn.Ecommerce.Store.repository;
import com.tuanvn.Ecommerce.Store.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository <User,Long>{
    User findByEmail(String email);

}
