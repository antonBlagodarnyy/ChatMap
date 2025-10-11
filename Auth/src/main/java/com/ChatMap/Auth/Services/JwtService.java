package com.ChatMap.Auth.Services;

import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import java.util.Date;

import javax.crypto.SecretKey;

@Service
public class JwtService {

	@Value("${JWT_KEY}")
	private String secretKey;

	@Value("${JWT_EXPIRATION}")
	private int expirtaionMs;


	private SecretKey getSigningKey() {

		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}

	public String generateJwtToken(Integer authenticatedId) {
		final String jwt = Jwts.builder().subject("" + authenticatedId).issuedAt(new Date())
				.expiration(new Date((new Date()).getTime() + expirtaionMs)).signWith(getSigningKey()).compact();


		return jwt;
	}


}