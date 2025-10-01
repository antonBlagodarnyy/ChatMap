package com.example.ChatMap.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.ChatMap.Dao.CustomUserDetails;
import com.example.ChatMap.Entities.User;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {
	// TODO store token secret in env
	private final String SECRET_KEY = "my_super_secure_32_characters_key!";

	public Integer extractUserId(String token) {
		return Integer.valueOf(Integer.parseInt(extractClaim(token, Claims::getSubject)));
	}

	public Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser().setSigningKey(SECRET_KEY.getBytes(StandardCharsets.UTF_8)).parseClaimsJws(token).getBody();

	}

	private Boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	public String generateToken(Integer userId) {
		Map<String, Object> claims = new HashMap<>();
		return createToken(claims, userId);
	}

	private String createToken(Map<String, Object> claims, Integer subject) {
		Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

		return Jwts.builder().setClaims(claims).setSubject(subject.toString()).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
				.signWith(key, SignatureAlgorithm.HS256).compact();
	}

	public Boolean validateToken(String token, Integer userId) {
		final Integer tokenUserId = extractUserId(token);
		return (tokenUserId.equals(userId) && !isTokenExpired(token));
	}
}
