package com.ChatMap.Profile.Dto;

public class CreateRequest {
	

	private String username;
	
	public CreateRequest(Integer id, String username) {
		super();
		this.username = username;
	}

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	
	
}
