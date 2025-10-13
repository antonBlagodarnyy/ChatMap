package com.ChatMap.Profile.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

@Service
public class JwtService {

	@Value("${JWT_KEY}")
	private String secretKey;

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
