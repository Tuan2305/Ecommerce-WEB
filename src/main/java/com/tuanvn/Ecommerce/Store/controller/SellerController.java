package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.domain.AccountStatus;
import com.tuanvn.Ecommerce.Store.exceptions.SellerException;
import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.modal.SellerReport;
import com.tuanvn.Ecommerce.Store.modal.VerificationCode;
import com.tuanvn.Ecommerce.Store.repository.VerificationCodeRepository;
import com.tuanvn.Ecommerce.Store.request.LoginOtpRequest;
import com.tuanvn.Ecommerce.Store.request.LoginRequest;
import com.tuanvn.Ecommerce.Store.response.ApiResponse;
import com.tuanvn.Ecommerce.Store.response.AuthResponse;
import com.tuanvn.Ecommerce.Store.service.AuthService;
import com.tuanvn.Ecommerce.Store.service.EmailService;
import com.tuanvn.Ecommerce.Store.service.SellerReportService;
import com.tuanvn.Ecommerce.Store.service.SellerService;
import com.tuanvn.Ecommerce.Store.utils.OtpUtil;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers")

public class SellerController {

    private final SellerService sellerService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final AuthService AuthService;
    private final EmailService EmailService;
    private final SellerReportService sellerReportService;

    public SellerController(SellerService sellerService, VerificationCodeRepository verificationCodeRepository, AuthService authService, EmailService emailService, SellerReportService sellerReportService) {
        this.sellerService = sellerService;
        this.verificationCodeRepository = verificationCodeRepository;
        this.authService = AuthService;
        this.emailService = EmailService;
        this.sellerReportService = sellerReportService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginSeller(
            @RequestBody LoginRequest req
    ) throws Exception {

        String otp = req.getOtp();
        String email = req.getEmail();

//        // Tìm OTP trong database
//        VerificationCode verificationCode = verificationCodeRepository.findByEmail(email);
//
//        // Kiểm tra OTP có đúng không
//        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
//            throw new Exception("Invalid OTP!");
//        }

        req.setEmail("seller_" + email);
        System.out.println(otp + " - "+email);
        AuthResponse authResponse = authService.signing(req);

        return ResponseEntity.ok(authResponse);
    }

    @PatchMapping("/verify/{otp}")
    public ResponseEntity<Seller> verifySellerEmail(
            @PathVariable String otp) throws Exception {

        VerificationCode verificationCode = verificationCodeRepository.findByOtp(otp);
        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new Exception("wrong otp...");
        }
        Seller seller = sellerService.verifyEmail(verificationCode.getEmail(), otp);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Seller> createSeller(
            @RequestBody Seller seller) throws Exception, MessagingException {
        Seller savedSeller = sellerService.createSeller(seller);

        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(seller.getEmail());
        verificationCodeRepository.save(verificationCode);

        String subject = "tUAN dEP traI";
        String text = "verify your account using this link ";
        String frontendUrl = "http://localhost:3306/verify-seller/";
        emailService.sendVerificationOtpEmail(seller.getEmail(), verificationCode.getOtp(), subject, text + frontendUrl);
        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws SellerException {
        Seller seller = sellerService.getSellerById(id);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }



    @GetMapping("/profile") // Lấy thông tin tài khoản từ JWT
    public ResponseEntity<Seller> getSellerByJwt(
            @RequestHeader("Authorization") String jwt) throws Exception {
        Seller seller = sellerService.getSellerProfile(jwt);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @GetMapping("/report")
    public ResponseEntity<SellerReport> getSellerReport(
            @RequestHeader("Authorization") String jwt) throws Exception {
//        String email = jwtProvider.getEmailFromJwtToken(jwt);
        Seller seller = sellerService.getSellerProfile(jwt);
        SellerReport report = sellerReportService.getSellerReport(seller);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(
            @RequestParam(required = false) AccountStatus status) {
        List<Seller> sellers = sellerService.getAllSellers(status);
        return ResponseEntity.ok(sellers);
    }

    @PatchMapping()
    public ResponseEntity<Seller> updateSeller (
            @RequestHeader("Authorization") String jwt,
            @RequestBody Seller seller) throws Exception{

        Seller profile = sellerService.getSellerProfile(jwt);
        Seller updatedSeller = sellerService.updateSeller (profile.getId(), seller);
        return ResponseEntity.ok(updatedSeller);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws Exception{
        sellerService.deleteSeller(id);
        return ResponseEntity.noContent().build();
    }

}

