package com.tuanvn.Ecommerce.Store.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class JwtProvider {
    SecretKey key = Keys.hmacShaKeyFor(JWT_CONSTANT.SECRET_KEY.getBytes()); // giúp tạo một khóa an toàn để ký JWT bằng thuật toán HMAC-SHA.

    public String generateToken(Authentication auth){
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String roles = populateAuthorities(authorities);

        return Jwts.builder()
                .setIssuedAt(new Date())  // Ngày phát hành
                .setExpiration(new Date(new Date().getTime()+86400000)) // Hết hạn sau 24h
                .claim("email", auth.getName()) // Lưu email người dùng vào token
                .claim("authorities", roles) // Lưu danh sách quyền của user
                .signWith(key) // Ký token với khóa bí mật
                .compact(); // Trả về chuỗi JWT
    }

//    Chức năng của hàm này
//Nhận JWT từ request và lấy email của người dùng từ token.
//Giải mã token bằng khóa bí mật (setSigningKey(key)).
//Trả về email của người dùng từ phần "claims" của JWT.


    public String getEmailFromJwtToken(String jwt){

        jwt = jwt.substring(7);

        Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(jwt).getBody();

        return String.valueOf(claims.get("email"));
    }


//Lấy danh sách quyền (roles) của người dùng từ Authentication.
//Trả về danh sách quyền dưới dạng chuỗi, cách nhau bởi dấu phẩy
    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {

        Set<String> auths = new HashSet<>();

        for(GrantedAuthority authority:authorities){
            auths.add(authority.getAuthority());

        }
        return String.join(",", auths);

    }

}
