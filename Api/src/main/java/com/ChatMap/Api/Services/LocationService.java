package com.ChatMap.Api.Services;


import com.ChatMap.Api.Dto.LocationDTO;
import com.ChatMap.Api.Dto.NearbyLocationsResponse;
import com.ChatMap.Api.Dto.UpdateLocationRequest;
import com.ChatMap.Api.Entities.Location;
import com.ChatMap.Api.Entities.User;
import com.ChatMap.Api.Models.CustomUserDetails;
import com.ChatMap.Api.Repositories.LocationRepository;
import com.ChatMap.Api.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    LocationRepository locationRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    public void updateLocation(UpdateLocationRequest updateLocationRequest) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        locationRepository.findById(user.getId()).ifPresentOrElse(
                loc -> {
                    loc.setLatitude(updateLocationRequest.latitude());
                    loc.setLongitude(updateLocationRequest.longitude());
                },
                () -> {
                    Location loc = new Location();
                    loc.setUser(user); // ✅ sets the ID via @MapsId
                    loc.setLatitude(updateLocationRequest.latitude());
                    loc.setLongitude(updateLocationRequest.longitude());
                    locationRepository.save(loc);
                }
        );
    }

    public Location getCurrentLocation() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return locationRepository.findById(userDetails.getId()).orElse(null);
    }

    public NearbyLocationsResponse getNearbyLocationsNotCurrent(Double lat, Double lon, Double radius) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return new NearbyLocationsResponse(
                locationRepository.findNearbyLocationsNotCurrent(
                                lat,
                                lon,
                                radius,
                                userDetails.getId())
                        .stream()
                        .map(l -> new LocationDTO(
                                l.getId(),
                                l.getLatitude(),
                                l.getLongitude(),
                                l.getUser().getUsername()))
                        .toList());
    }
}
