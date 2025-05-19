package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.Address;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.request.AddressRequest;

import java.util.List;

public interface AddressService {

    Address createAddress(String jwt, AddressRequest addressRequest) throws Exception;

    void deleteAddress(String jwt, Long addressId) throws Exception;

    List<Address> getAllAddresses(String jwt) throws Exception;

    Address getAddressById(String jwt, Long addressId) throws Exception;

    Address setDefaultAddress(String jwt, Long addressId) throws Exception;
}