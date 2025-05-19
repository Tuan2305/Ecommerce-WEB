package com.tuanvn.Ecommerce.Store.controller;


import com.tuanvn.Ecommerce.Store.domain.USER_ROLE;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.response.AuthResponse;
import com.tuanvn.Ecommerce.Store.response.SignupRequest;
import com.tuanvn.Ecommerce.Store.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tuanvn.Ecommerce.Store.request.UpdateProfileRequest;
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/profile")
    public ResponseEntity<User> createUserHandler(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

            User user = userService.findUserByJwtToken(jwt);

        return ResponseEntity.ok(user);

    }
    @PutMapping("/users/profile")
    public ResponseEntity<User> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UpdateProfileRequest req
    ) throws Exception {
        User updatedUser = userService.updateProfile(jwt, req);
        return ResponseEntity.ok(updatedUser);
    }
}
