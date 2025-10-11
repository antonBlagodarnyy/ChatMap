package com.ChatMap.Auth.Dto;


public class LoginRequest {

	private String email;
	private String password;
	public LoginRequest() {
		super();
	}
	public LoginRequest(String username, String password) {
		super();
		this.email = username;
		this.password = password;
	}

	public String getEmail() {
		return email;
	}
	public void setEmail(String username) {
		this.email = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Override
	public String toString() {
		return "AuthenticationRequest [username=" + email + ", password=" + password + "]";
	}
	
}