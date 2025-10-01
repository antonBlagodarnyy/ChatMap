package com.example.ChatMap.Dto;

public class UserResponse {
	private Integer id;
	private String username;
	private String email;
	
	public UserResponse(Integer id,String username,  String email) {
		super();
		this.username = username;
		this.id = id;
		this.email = email;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
}
