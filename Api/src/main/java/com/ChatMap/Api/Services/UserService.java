package com.ChatMap.Api.Services;

import com.ChatMap.Api.Entities.User;
import com.ChatMap.Api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findUserById(Integer userId){
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
