package com.ChatMap.Auth.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ChatMap.Auth.Filters.ValidateJwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	 PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Autowired
	ValidateJwtFilter validateJwtFilter;
	

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf((csrf) -> csrf.disable())

				.authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**","/health").permitAll()
						.anyRequest().authenticated())
				.addFilterBefore(validateJwtFilter, UsernamePasswordAuthenticationFilter.class)
				;

				
		return http.build();
	}
}
