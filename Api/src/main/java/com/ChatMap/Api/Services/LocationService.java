package com.ChatMap.Api.Services;


import com.ChatMap.Api.Dto.CreateLocationRequest;
import com.ChatMap.Api.Entities.Location;
import com.ChatMap.Api.Models.CustomUserDetails;
import com.ChatMap.Api.Repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    LocationRepository locationRepository;

    public void createLocation(CreateLocationRequest createLocationRequest) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Location location = new Location();
        location.setLatitude(createLocationRequest.getLatitude());
        location.setLongitude(createLocationRequest.getLongitude());
        location.setId(Integer.parseInt(userDetails.getUsername()));

        locationRepository.save(location);
    }

    public Location getCurrentLocation() {
        CustomUserDetails  userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return locationRepository.findById(userDetails.getId()).orElse(null);
    }

    public List<Location> getNearbyLocationsNotCurrent(Double lat, Double lon, Double radius) {
        CustomUserDetails  userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

            return locationRepository.findNearbyLocationsNotCurrent(lat,
                    lon, radius, userDetails.getId());
    }
}
