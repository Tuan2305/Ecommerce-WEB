package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.config.JwtProvider;
import com.tuanvn.Ecommerce.Store.domain.AccountStatus;
import com.tuanvn.Ecommerce.Store.domain.USER_ROLE;
import com.tuanvn.Ecommerce.Store.exceptions.SellerException;
import com.tuanvn.Ecommerce.Store.modal.Address;
import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.repository.AddressRepository;
import com.tuanvn.Ecommerce.Store.repository.SellerRepository;
import com.tuanvn.Ecommerce.Store.service.SellerService;
import jakarta.mail.search.SearchTerm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;


    public SellerServiceImpl(SellerRepository sellerRepository, JwtProvider jwtProvider, PasswordEncoder passwordEncoder, AddressRepository addressRepository) {
        this.sellerRepository = sellerRepository;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = passwordEncoder;
        this.addressRepository = addressRepository;
    }

    @Override
    public Seller getSellerProfile(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        return this.getSellerByEmail(email);
    }

    @Override
    public Seller createSeller(Seller seller) throws Exception {
        Seller sellerExist = sellerRepository.findByEmail(seller.getEmail());
        if(sellerExist != null){
            throw new Exception("seller already exits, used different email");
        }
        Address saveAddress = addressRepository.save(seller.getPickupAddress());

        Seller newSeller = new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setPickupAddress(saveAddress);

        newSeller.setGSTIN(seller.getGSTIN()); // chưa cần thiết lắm

        newSeller.setRole(USER_ROLE.ROLE_SELLER);
        newSeller.setMobile(seller.getMobile());
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBusinessDetails(seller.getBusinessDetails());


        return sellerRepository.save(newSeller);
    }

    @Override
    public Seller getSellerById(Long id) throws SellerException {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new SellerException("seller not found with id " +id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws Exception {

        Seller seller= sellerRepository.findByEmail(email);
        if(seller == null){
            throw new Exception("seller not found ");
        }
        return seller;
    }

    @Override
    public List<Seller> getAllSellers(AccountStatus status) {
        return sellerRepository.findByAccountStatus(status);
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) throws Exception {

        Seller existingSeller = this.getSellerById(id);

        if (seller.getSellerName() != null) {
            existingSeller.setSellerName(seller.getSellerName());
        }
        if (seller.getMobile() != null) {
            existingSeller.setMobile(seller.getMobile());
        }
        if (seller.getEmail() != null) {
            existingSeller.setEmail(seller.getEmail());
        }
        if (seller.getBusinessDetails() != null && seller.getBusinessDetails().getBusinessName()!= null){
            existingSeller.getBusinessDetails().setBusinessName(
                    seller.getBusinessDetails().getBusinessName()
            );
        }
        if(seller.getBankDetails() != null
            && seller.getBankDetails().getAccountHolderName() != null
                && seller.getBankDetails().getIfscCode() != null
                && seller.getBankDetails().getAccountNumber() != null
        ){
            existingSeller.getBankDetails().setAccountHolderName(
                    seller.getBankDetails().getAccountHolderName()
            );
            existingSeller.getBankDetails().setAccountNumber(
                    seller.getBankDetails().getAccountNumber()
            );
            existingSeller.getBankDetails().setIfscCode(
                    seller.getBankDetails().getIfscCode()
            );
        }

        if(seller.getPickupAddress() != null
                && seller.getPickupAddress().getAddress() != null
                && seller.getPickupAddress().getMobile() != null
                && seller.getPickupAddress().getCity() != null

        ){
            existingSeller.getPickupAddress().setAddress(seller.getPickupAddress().getAddress());
            existingSeller.getPickupAddress().setCity(seller.getPickupAddress().getCity());
            existingSeller.getPickupAddress().setMobile(seller.getPickupAddress().getMobile());
        }
        if(seller.getGSTIN()!= null){
            existingSeller.setGSTIN(seller.getGSTIN());
        }
        return sellerRepository.save(existingSeller);
    }

    @Override
    public void deleteSeller(Long id) throws Exception {
        Seller seller = getSellerById(id);
        sellerRepository.delete(seller);
    }

    @Override
    public Seller verifyEmail(String email, String otp) throws Exception {
        Seller seller = getSellerByEmail(email);
        seller.setEmailVerified(true);
        return sellerRepository.save(seller);
    }

    @Override
    public Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws Exception {
        Seller seller = getSellerById(sellerId);
        seller.setAccountStatus(status);
        return sellerRepository.save(seller);
    }
}
