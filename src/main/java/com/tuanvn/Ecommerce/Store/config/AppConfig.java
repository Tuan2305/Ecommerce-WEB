package com.tuanvn.Ecommerce.Store.config;

import jakarta.servlet.http.HttpServletRequest;
import org.hibernate.engine.spi.CollectionEntry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.sessionManagement(management -> management.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS
        )).authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/**").authenticated()
                .requestMatchers("/api/products/*/reviews").permitAll()
                .anyRequest().permitAll()).addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable())
                .cors(cors ->cors.configurationSource(corsConfigurationSource()));

        return http.build();

    }

    private CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration cfg = new CorsConfiguration();
            cfg.setAllowedOrigins(Collections.singletonList("http://localhost:3000")); // Allow frontend on port 3000
            cfg.setAllowedMethods(Collections.singletonList("*")); // Allow all HTTP methods
            cfg.setAllowedHeaders(Collections.singletonList("*")); // Allow all headers
            cfg.setAllowCredentials(true); // Allow credentials (e.g., cookies, authorization headers)
            cfg.setExposedHeaders(Collections.singletonList("Authorization")); // Expose Authorization header
            cfg.setMaxAge(3600L); // Cache preflight response for 1 hour
            return cfg;
        };
    }

    @Bean
    PasswordEncoder passwordEncoder(){

        return new BCryptPasswordEncoder();
    }

    @Bean
//    RestTemplate là công cụ của Spring giúp gọi API bên ngoài từ server.
    public RestTemplate restTemplate(){

        return new RestTemplate();
    }

}
