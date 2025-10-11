package com.ChatMap.Auth.Exceptions;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<?> handleAuthenticationException(EmailAlreadyExistsException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST) // 400
				.body(Map.of("error", ex.getMessage()));
	}
	@ExceptionHandler(IncorrectPasswordException.class)
	public ResponseEntity<?> handleAuthenticationException(IncorrectPasswordException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // 401
				.body(Map.of("error", ex.getMessage()));
	}
	@ExceptionHandler(NoEmailFoundException.class)
	public ResponseEntity<?> handleAuthenticationException(NoEmailFoundException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // 401
				.body(Map.of("error", ex.getMessage()));
	}
}
