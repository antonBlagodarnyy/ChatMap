package com.ChatMap.Auth.Services;

import java.time.Instant;
import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.interfaces.DecodedJWT;

@Service
public class JwtService {

	@Value("${JWT_KEY}")
	private String secretKey;

	@Value("${JWT_EXPIRATION}")
	private Long expirationMs;

	public String generateJwtToken(Integer authenticatedId) {
		String token = null;
		Calendar time = Calendar.getInstance();
		time.setTimeInMillis(time.getTimeInMillis()+expirationMs);
		try {
			Algorithm algorithm = Algorithm.HMAC256(secretKey);
			token = JWT.create().withIssuer("ChatMapAuth").withSubject("" + authenticatedId)
					.withExpiresAt(time.getTime()).sign(algorithm);
		} catch (JWTCreationException exception) {
			System.out.println(exception);
		}

		return token;
	}

	public DecodedJWT decodeJwt(String token) {
		DecodedJWT decodedJWT = null;

		Algorithm algorithm = Algorithm.HMAC256(secretKey);
		JWTVerifier verifier = JWT.require(algorithm)
				// specify any specific claim validations
				.withIssuer("ChatMapAuth")
				// reusable verifier instance
				.build();

		decodedJWT = verifier.verify(token);

		return decodedJWT;
	}

	public Integer extractUserId(String authorizationHeader) {
		String jwt = null;
		DecodedJWT decodedJwt = null;

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			jwt = authorizationHeader.substring(7);
			decodedJwt = this.decodeJwt(jwt);
		}
		String userId = decodedJwt.getSubject();

		return Integer.valueOf(userId);
	}

}