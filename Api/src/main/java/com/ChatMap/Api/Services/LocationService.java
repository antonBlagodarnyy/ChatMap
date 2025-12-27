package com.ChatMap.Api.Services;


import com.ChatMap.Api.Dto.AddressDTO;
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
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;


@Service
public class LocationService {

    @Autowired
    private WebClient webClient;

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

        Location location = locationRepository.findById(user.getId()).orElseGet(() -> {
            Location loc = new Location();
            loc.setUser(user);
            return loc;
        });

        location.setLatitude(updateLocationRequest.latitude());
        location.setLongitude(updateLocationRequest.longitude());

        AddressDTO addressDto = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("nominatim.openstreetmap.org")
                        .path("/reverse")
                        .queryParam("lat", updateLocationRequest.latitude())
                        .queryParam("lon", updateLocationRequest.longitude())
                        .queryParam("format", "json")
                        .build()
                )
                .retrieve()
                .bodyToMono(AddressDTO.class)
                .block();


        Optional.ofNullable(addressDto)
                .map(AddressDTO::address)
                .filter(a -> a.country() != null && a.city() != null)
                .ifPresent(a -> {
                    location.setAddress(a.country() + ", " + a.city());
                });

        locationRepository.save(location);


    }


    public LocationDTO getCurrentLocation() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return locationRepository.findById(userDetails.getId()).map(location -> new LocationDTO(
                        location.getId(),
                        location.getLatitude(),
                        location.getLongitude(),
                        location.getUser().getUsername(),
                        location.getAddress()
                ))
                .orElse(null);
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
                                l.getUser().getUsername(),
                                l.getAddress()))
                        .toList());
    }
}
