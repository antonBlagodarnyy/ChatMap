package com.ChatMap.Message.Config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ChatMap.Message.Filters.ValidateJwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	ValidateJwtFilter validateJwtFilter;
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf((csrf) -> csrf.disable())

				.authorizeHttpRequests(auth -> auth.requestMatchers("/health").permitAll()
						.anyRequest().authenticated())
				.addFilterBefore(validateJwtFilter, UsernamePasswordAuthenticationFilter.class)
				
		;

		return http.build();
	}
}
