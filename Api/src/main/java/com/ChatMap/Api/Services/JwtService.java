package com.ChatMap.Api.Services;

import java.util.Calendar;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;



@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.key}")
	private String secretKey;

	@Value("${jwt.expiration}")
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
			log.error("e: ", exception);
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



}