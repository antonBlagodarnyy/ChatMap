package com.ChatMap.Auth.Exceptions;

public class NoEmailFoundException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public NoEmailFoundException() {
		super("No email found");
	}
}
