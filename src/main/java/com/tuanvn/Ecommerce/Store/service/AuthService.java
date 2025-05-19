package com.tuanvn.Ecommerce.Store.service;


import com.tuanvn.Ecommerce.Store.domain.USER_ROLE;
import com.tuanvn.Ecommerce.Store.request.LoginRequest;
import com.tuanvn.Ecommerce.Store.response.AuthResponse;
import com.tuanvn.Ecommerce.Store.response.SignupRequest;

public interface AuthService {

    void sentLoginOtp(String email, USER_ROLE role) throws Exception;

    String createUser(SignupRequest req) throws Exception;

    AuthResponse signing(LoginRequest req) throws Exception;
}
