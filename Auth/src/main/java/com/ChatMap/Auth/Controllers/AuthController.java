package com.ChatMap.Auth.Controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ChatMap.Auth.Dto.LoginRequest;
import com.ChatMap.Auth.Dto.SignupRequest;

import com.ChatMap.Auth.Services.AuthService;

@Controller
@RequestMapping(path = "/auth")
@RestController
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/signup")
	public @ResponseBody ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
		final String jwt = authService.saveUser(signupRequest);

		return ResponseEntity.ok(Map.of("jwt", jwt));
	}

	@PostMapping(path = "/login")
	public @ResponseBody ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) throws Exception {

		final String jwt = authService.loginUser(loginRequest);

		return ResponseEntity.ok(Map.of("jwt", jwt));
	}


}
