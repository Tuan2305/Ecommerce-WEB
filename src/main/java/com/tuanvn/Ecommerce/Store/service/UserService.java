package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.request.UpdateProfileRequest;

public interface UserService {
    User findUserByJwtToken(String jwt) throws Exception;
    User findUserByEmail(String email) throws Exception;
    User updateProfile(String jwt, UpdateProfileRequest req) throws Exception;
}
