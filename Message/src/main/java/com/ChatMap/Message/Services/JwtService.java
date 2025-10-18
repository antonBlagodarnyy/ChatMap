package com.ChatMap.Message.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

@Service
public class JwtService {

	@Value("${JWT_KEY}")
	private String secretKey;

	public DecodedJWT decodeJwt(String token) {
		DecodedJWT decodedJWT = null;
		try {
			Algorithm algorithm = Algorithm.HMAC256(secretKey);
			JWTVerifier verifier = JWT.require(algorithm)
					// specify any specific claim validations
					.withIssuer("ChatMapAuth")
					// reusable verifier instance
					.build();

			decodedJWT = verifier.verify(token);

		} catch (JWTVerificationException exception) {
			System.out.println(exception);
		}
		return decodedJWT;
	}
}
