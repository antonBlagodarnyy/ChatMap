package com.ChatMap.Api.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ChatMap.Api.Dto.LoginRequest;
import com.ChatMap.Api.Dto.SignupRequest;
import com.ChatMap.Api.Entities.User;
import com.ChatMap.Api.Exceptions.EmailAlreadyExistsException;
import com.ChatMap.Api.Exceptions.IncorrectPasswordException;
import com.ChatMap.Api.Exceptions.NoEmailFoundException;
import com.ChatMap.Api.Repositories.UserRepository;

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

	public void deleteUser() {
		Integer userId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		userRepository.deleteById(userId);
	}
}
