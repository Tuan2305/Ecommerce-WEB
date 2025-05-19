package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.Address;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.repository.AddressRepository;
import com.tuanvn.Ecommerce.Store.request.AddressRequest;
import com.tuanvn.Ecommerce.Store.service.AddressService;
import com.tuanvn.Ecommerce.Store.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserService userService;

    public AddressServiceImpl(AddressRepository addressRepository, UserService userService) {
        this.addressRepository = addressRepository;
        this.userService = userService;
    }

    @Override
    public Address createAddress(String jwt, AddressRequest addressRequest) throws Exception {
        User user = userService.findUserByJwtToken(jwt);

        Address address = new Address();
        address.setName(addressRequest.getName());
        address.setAddress(addressRequest.getAddress());
        address.setCity(addressRequest.getCity());
        address.setMobile(addressRequest.getMobile());
        address.setUser(user);

        // If this is the first address or explicitly set as default
        if (addressRepository.findByUser(user).isEmpty() ||
                Boolean.TRUE.equals(addressRequest.getIsDefault())) {

            // Unset any existing default addresses
            List<Address> existingDefaultAddresses = addressRepository.findByUserAndIsDefaultTrue(user);
            for (Address defaultAddress : existingDefaultAddresses) {
                defaultAddress.setIsDefault(false);
                addressRepository.save(defaultAddress);
            }

            address.setIsDefault(true);
        }

        return addressRepository.save(address);
    }
    @Override
    public void deleteAddress(String jwt, Long addressId) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Address address = getAddressById(jwt, addressId);

        addressRepository.delete(address);

        // If the deleted address was the default address, and there are other addresses,
        // set the first one as default
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            List<Address> remainingAddresses = addressRepository.findByUser(user);
            if (!remainingAddresses.isEmpty()) {
                Address newDefault = remainingAddresses.get(0);
                newDefault.setIsDefault(true);
                addressRepository.save(newDefault);
            }
        }
    }

    @Override
    public List<Address> getAllAddresses(String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return addressRepository.findByUser(user);
    }

    @Override
    public Address getAddressById(String jwt, Long addressId) throws Exception {
        User user = userService.findUserByJwtToken(jwt);

        Optional<Address> optionalAddress = addressRepository.findById(addressId);
        if (optionalAddress.isEmpty()) {
            throw new Exception("Address not found with id: " + addressId);
        }

        Address address = optionalAddress.get();

        // Check if address belongs to user
        if (address.getUser() == null || !address.getUser().getId().equals(user.getId())) {
            throw new Exception("You don't have permission to access this address");
        }

        return address;
    }

    @Override
    public Address setDefaultAddress(String jwt, Long addressId) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Address address = getAddressById(jwt, addressId);

        // Unset any existing default addresses
        List<Address> existingDefaultAddresses = addressRepository.findByUserAndIsDefaultTrue(user);
        for (Address defaultAddress : existingDefaultAddresses) {
            defaultAddress.setIsDefault(false);
            addressRepository.save(defaultAddress);
        }

        // Set the new default
        address.setIsDefault(true);
        return addressRepository.save(address);
    }
}