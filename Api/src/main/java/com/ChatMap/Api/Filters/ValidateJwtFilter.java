package com.ChatMap.Api.Filters;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ChatMap.Api.Services.JwtService;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ValidateJwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtService jwtService;

	   private final List<String> excludedPaths = List.of(
		        "/health",
		        "/auth"
		    );
	   
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getRequestURI();
	    return excludedPaths.stream().anyMatch(p -> path.contains(p));
	}
	
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		System.out.println("Filter hit");
		try {
			final String authorizationHeader = request.getHeader("Authorization");

			String jwt = null;
			DecodedJWT decodedJwt = null;

			if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
				jwt = authorizationHeader.substring(7);
				decodedJwt = jwtService.decodeJwt(jwt);
			}
			String userId = decodedJwt.getSubject();

			if (userId == null)
				throw new JWTVerificationException("No user in the jwt");

			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
					Integer.parseInt(userId), null, List.of());

			SecurityContextHolder.getContext().setAuthentication(authToken);
		} catch (Exception e) {
			System.out.println("JWT validation failed: " + e.getMessage());
		}

		filterChain.doFilter(request, response);
	}

}
