package com.ChatMap.Api.Controllers;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ChatMap.Api.Dto.LoginRequest;
import com.ChatMap.Api.Dto.SignupRequest;

import com.ChatMap.Api.Services.AuthService;

@Controller
@RequestMapping(path = "/auth")
@RestController
public class AuthController {

	private static final Logger log = LoggerFactory.getLogger(AuthController.class);
	@Autowired
	private AuthService authService;

	@PostMapping("/signup")
	public @ResponseBody ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
		return ResponseEntity.ok(authService.saveUser(signupRequest));
	}

	@PostMapping(path = "/login")
	public @ResponseBody ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) throws Exception {
		return ResponseEntity.ok(authService.loginUser(loginRequest));
	}


}
