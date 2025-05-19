package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.modal.Address;
import com.tuanvn.Ecommerce.Store.request.AddressRequest;
import com.tuanvn.Ecommerce.Store.response.ApiResponse;
import com.tuanvn.Ecommerce.Store.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<Address> createAddress(
            @RequestHeader("Authorization") String jwt,
            @RequestBody AddressRequest addressRequest
    ) throws Exception {
        Address address = addressService.createAddress(jwt, addressRequest);
        return ResponseEntity.ok(address);
    }

    @GetMapping
    public ResponseEntity<List<Address>> getAllAddresses(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        List<Address> addresses = addressService.getAllAddresses(jwt);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("id") Long addressId
    ) throws Exception {
        Address address = addressService.getAddressById(jwt, addressId);
        return ResponseEntity.ok(address);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAddress(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("id") Long addressId
    ) throws Exception {
        addressService.deleteAddress(jwt, addressId);

        ApiResponse response = new ApiResponse();
        response.setMessage("Address deleted successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<Address> setDefaultAddress(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("id") Long addressId
    ) throws Exception {
        Address address = addressService.setDefaultAddress(jwt, addressId);
        return ResponseEntity.ok(address);
    }
}
