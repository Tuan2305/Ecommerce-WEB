package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.config.JwtProvider;
import com.tuanvn.Ecommerce.Store.domain.USER_ROLE;
import com.tuanvn.Ecommerce.Store.modal.Cart;
import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.modal.User;
import com.tuanvn.Ecommerce.Store.modal.VerificationCode;
import com.tuanvn.Ecommerce.Store.repository.CartRepository;
import com.tuanvn.Ecommerce.Store.repository.SellerRepository;
import com.tuanvn.Ecommerce.Store.repository.UserRepository;
import com.tuanvn.Ecommerce.Store.repository.VerificationCodeRepository;
import com.tuanvn.Ecommerce.Store.request.LoginRequest;
import com.tuanvn.Ecommerce.Store.response.AuthResponse;
import com.tuanvn.Ecommerce.Store.response.SignupRequest;
import com.tuanvn.Ecommerce.Store.service.AuthService;
import com.tuanvn.Ecommerce.Store.service.EmailService;
import com.tuanvn.Ecommerce.Store.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final JwtProvider jwtProvider;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomUserServiceImpl customUserService;
    private final SellerRepository sellerRepository;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, CartRepository cartRepository, JwtProvider jwtProvider, VerificationCodeRepository verificationCodeRepository, EmailService emailService, CustomUserServiceImpl customUserService, SellerRepository sellerRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cartRepository = cartRepository;
        this.jwtProvider = jwtProvider;
        this.verificationCodeRepository = verificationCodeRepository;
        this.emailService = emailService;
        this.customUserService = customUserService;
        this.sellerRepository = sellerRepository;
    }
    @Override
    public void sentLoginOtp(String email, USER_ROLE role) throws Exception {
        String SIGNING_PREFIX = "signing_";

        if(email.startsWith(SIGNING_PREFIX)){
            email = email.substring(SIGNING_PREFIX.length());
            if(role.equals(USER_ROLE.ROLE_SELLER)){
                Seller seller= sellerRepository.findByEmail(email);
                if(seller == null){
                    throw new Exception("seller not found");
                }
            }
            else{
                System.out.println("email" + email);
                User user = userRepository.findByEmail(email);
                if(user == null){
                    throw new Exception("User not exit with provided email");
                }
            }
        }
        VerificationCode isExist = verificationCodeRepository.findByEmail(email);
        if(isExist != null){
            verificationCodeRepository.delete(isExist);
        }
        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode= new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(email);
        verificationCodeRepository.save(verificationCode);

        String subject =" login/ signup otp";
        String text = "your login/ signup otp is - "+ otp;

        emailService.sendVerificationOtpEmail(email, otp, subject, text);
    }

    @Override
    public String createUser(SignupRequest req) throws Exception {
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(req.getEmail());
        if (verificationCode == null || !verificationCode.getOtp().equals(req.getOtp())){
            throw  new Exception("wrong otp ...");
        }
        User user = userRepository.findByEmail(req.getEmail());
        if(user == null){
            User createUser = new User();
            createUser.setEmail(req.getEmail());
            createUser.setFullName(req.getFullName());
            createUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            createUser.setMobile("0123456789");
            createUser.setPassword(passwordEncoder.encode(req.getOtp()));

            user = userRepository.save(createUser);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));

        Authentication authentication= new UsernamePasswordAuthenticationToken(req.getEmail(), null,authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);



        return jwtProvider.generateToken(authentication);
    }

    @Override
public AuthResponse signing(LoginRequest req) throws Exception {
    String username = req.getEmail();
    String otp = req.getOtp();

    Authentication authentication = authenticate(username, otp);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    String token = jwtProvider.generateToken(authentication);
    
    AuthResponse authResponse = new AuthResponse();
    authResponse.setJwt(token);
    authResponse.setMessage("Login success");

    String SELLER_PREFIX = "seller_";
    
    // Kiểm tra xem đây là đăng nhập của người bán hay người dùng thông thường
    if (username.startsWith(SELLER_PREFIX)) {
        // Xử lý cho người bán
        String sellerEmail = username.substring(SELLER_PREFIX.length());
        Seller seller = sellerRepository.findByEmail(sellerEmail);
        if (seller == null) {
            throw new Exception("Người bán không tồn tại");
        }
        authResponse.setId(seller.getId());
        authResponse.setEmail(seller.getEmail());
        authResponse.setFullName(seller.getSellerName()); // Hoặc phương thức tương ứng
    } else {
        // Xử lý cho người dùng thông thường
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new Exception("Người dùng không tồn tại");
        }
        authResponse.setId(user.getId());
        authResponse.setEmail(user.getEmail());
        authResponse.setFullName(user.getFullName());
    }

    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
    authResponse.setRole(USER_ROLE.valueOf(roleName));
    
    return authResponse;
}


    private Authentication authenticate(String username, String otp) throws Exception {

        UserDetails userDetails = customUserService.loadUserByUsername(username);

        String SELLER_PREFIX = "seller_";

        if(username.startsWith(SELLER_PREFIX)){
            username= username.substring(SELLER_PREFIX.length());
        }

        if(userDetails == null){
            throw new BadCredentialsException("Invalid username");
        }

        VerificationCode verificationCode = verificationCodeRepository.findByEmail(username);
        if(verificationCode == null || !verificationCode.getOtp().equals(otp)){
            throw new Exception("Wrong otp");

        }
        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

    }
}

