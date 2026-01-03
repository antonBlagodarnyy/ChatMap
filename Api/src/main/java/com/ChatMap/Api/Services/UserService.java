package com.ChatMap.Api.Services;

import com.ChatMap.Api.Dto.UserThumbnailDTO;
import com.ChatMap.Api.Dto.UsersThumbnailsResponse;
import com.ChatMap.Api.Entities.Location;
import com.ChatMap.Api.Entities.User;
import com.ChatMap.Api.Models.CustomUserDetails;
import com.ChatMap.Api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findUserById(Integer userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UsersThumbnailsResponse getUsersThumbnails() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UsersThumbnailsResponse(
                userRepository.findByIdNot(currentUser.getId())
                        .stream()
                        .map(this::userToThumbnail)
                        .toList());
    }

    private UserThumbnailDTO userToThumbnail(User user) {

        return new UserThumbnailDTO(
                user.getId(),
                user.getUsername(),
                user.getLocation() != null ? user.getLocation().getAddress() : "Unknown",
                user.getLocation() != null ? user.getLocation().getLatitude() : null,
                user.getLocation() != null ? user.getLocation().getLongitude() : null
        );
    }
}
