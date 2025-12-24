package com.ChatMap.Api.Exceptions;

public class IncorrectPasswordException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public IncorrectPasswordException() {
		super("Incorrect password.");
	}
}
