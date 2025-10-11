package com.ChatMap.Auth.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ChatMap.Auth.Dto.LoginRequest;
import com.ChatMap.Auth.Dto.SignupRequest;
import com.ChatMap.Auth.Entities.User;
import com.ChatMap.Auth.Exceptions.EmailAlreadyExistsException;
import com.ChatMap.Auth.Exceptions.IncorrectPasswordException;
import com.ChatMap.Auth.Exceptions.NoEmailFoundException;
import com.ChatMap.Auth.Repositories.UserRepository;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public String saveUser(SignupRequest signupRequest) {

		if (userRepository.findByEmail(signupRequest.getEmail()) != null)
			throw new EmailAlreadyExistsException();

		User user = new User();

		user.setEmail(signupRequest.getEmail());
		user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

		userRepository.save(user);

		return jwtService.generateJwtToken(user.getId());
	}

	public String loginUser(LoginRequest loginRequest) {

		User user = userRepository.findByEmail(loginRequest.getEmail());

		if (user == null)
			throw new NoEmailFoundException();

		if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
			throw new IncorrectPasswordException();
		}

		return jwtService.generateJwtToken(user.getId());

	}
}
