package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/ecommerceshop")
    public ApiResponse HomeControllerHandler(){
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("hello");

        return apiResponse;
    }
}
