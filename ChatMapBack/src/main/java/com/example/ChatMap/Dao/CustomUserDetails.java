package com.example.ChatMap.Dao;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class CustomUserDetails implements UserDetails {

	private String username;
	private Integer id;
	private String email;

	@JsonIgnore
	private String password;


	public CustomUserDetails(String username, Integer id, String email, String password) {
		super();
		this.username = username;
		this.id = id;
		this.email = email;
		this.password = password;

	}

	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		return null;
	}

	@Override
	public String getPassword() {

		return this.password;
	}

	@Override
	public String getUsername() {

		return this.username;
	}

	public Integer getId() {
		return this.id;
	}

	public String getEmail() {
		return this.email;
	}
}
