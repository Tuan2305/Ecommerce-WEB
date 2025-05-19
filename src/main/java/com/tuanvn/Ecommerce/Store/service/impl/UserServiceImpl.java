package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.config.JwtProvider;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.repository.UserRepository;
import com.tuanvn.Ecommerce.Store.request.UpdateProfileRequest;
import com.tuanvn.Ecommerce.Store.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public UserServiceImpl(UserRepository userRepository, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
    }

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);

        return this.findUserByEmail(email);
    }

    @Override
    public User findUserByEmail(String email) throws Exception {

        User user=userRepository.findByEmail(email);
        if(user == null){
            throw new Exception("User not found with email +"+email);
        }

        return user;
    }

    @Override
    public User updateProfile(String jwt, UpdateProfileRequest req) throws Exception {
        User user = findUserByJwtToken(jwt);

        if (req.getFullName() != null && !req.getFullName().isEmpty()) {
            user.setFullName(req.getFullName());
        }

        if (req.getMobile() != null && !req.getMobile().isEmpty()) {
            user.setMobile(req.getMobile());
        }

        if (req.getGender() != null) {
            user.setGender(req.getGender());
        }

        if (req.getBirthday() != null) {
            user.setBirthday(req.getBirthday());
        }

        return userRepository.save(user);
    }
}
