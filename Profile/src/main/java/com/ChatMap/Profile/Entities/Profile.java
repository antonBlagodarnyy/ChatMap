package com.ChatMap.Profile.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Profile")
public class Profile {
	
	@Id
	private Integer id;
	
	private String username;
	
	public Profile() {
		super();
	}

	public Profile(Integer id, String username) {
		super();
		this.id = id;
		this.username = username;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
}
