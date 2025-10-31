package com.ChatMap.Profile.Dto;

import java.util.HashMap;

public class MultipleUsernamesResponse {
	private HashMap<Integer, String> usernames;

	public MultipleUsernamesResponse(HashMap<Integer, String> usernames) {
		super();
		this.usernames = usernames;
	}

	public HashMap<Integer, String> getUsernames() {
		return usernames;
	}

	public void setUsernames(HashMap<Integer, String> usernames) {
		this.usernames = usernames;
	}
	
}
