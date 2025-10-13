package com.ChatMap.Friend.Config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ChatMap.Friend.Filters.ValidateJwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	ValidateJwtFilter validateJwtFilter() {
		return new ValidateJwtFilter();
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf((csrf) -> csrf.disable())

				.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
				.addFilterBefore(validateJwtFilter(), UsernamePasswordAuthenticationFilter.class)

		;

		return http.build();
	}
}
