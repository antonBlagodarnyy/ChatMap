package com.ChatMap.Profile.Dto;

public class CreateRequest {
	
	private Integer id;
	private String username;
	
	public CreateRequest(Integer id, String username) {
		super();
		this.id = id;
		this.username = username;
	}
	public Integer getId() {
		return id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	
	
}
