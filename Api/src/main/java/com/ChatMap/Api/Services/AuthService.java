package com.ChatMap.Api.Services;

import com.ChatMap.Api.Dto.LoginResponse;
import com.ChatMap.Api.Dto.SignupResponse;
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

    public SignupResponse saveUser(SignupRequest signupRequest) {
        if (userRepository.findByEmail(signupRequest.email()) != null)
            throw new EmailAlreadyExistsException();

        User user = new User(
                signupRequest.email(),
                passwordEncoder.encode(signupRequest.password()),
                signupRequest.username()
                );

        User newUser = userRepository.save(user);

        return new SignupResponse(jwtService.generateJwtToken(
                newUser.getId()),
                newUser.getUsername());
    }


    public LoginResponse loginUser(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.email());

        if (user == null)
            throw new NoEmailFoundException();

        if (!passwordEncoder.matches(loginRequest.password(), user.getPassword()))
            throw new IncorrectPasswordException();


        return new LoginResponse(jwtService.generateJwtToken(
                user.getId()),
                user.getUsername());

    }


    public void deleteUser() {
        Integer userId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        userRepository.deleteById(userId);
    }
}
