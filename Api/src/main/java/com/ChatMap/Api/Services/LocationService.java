package com.ChatMap.Api.Services;


import com.ChatMap.Api.Dto.CreateLocationRequest;
import com.ChatMap.Api.Entities.Location;
import com.ChatMap.Api.Repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

	@Autowired
	LocationRepository locationRepository;

	public void createLocation(CreateLocationRequest createLocationRequest) {
		Integer id = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Location location = new Location();
		location.setLatitude(createLocationRequest.getLatitude());
		location.setLongitude(createLocationRequest.getLongitude());
		location.setId(id);

		locationRepository.save(location);
	}

	public Location getCurrentLocation() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (principal instanceof Integer id) {
			return locationRepository.findById(id).orElse(null);
		}

		return null;
	}

	public List<Location> getNearbyLocationsNotCurrent(Double lat, Double lon, Double radius) {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (principal instanceof Integer id)
			return locationRepository.findNearbyLocationsNotCurrent(lat,
					lon, radius, id);
		else
			return null;
	}
}
