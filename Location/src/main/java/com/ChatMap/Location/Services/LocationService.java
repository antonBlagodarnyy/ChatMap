package com.ChatMap.Location.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ChatMap.Location.Dto.CreateLocationRequest;
import com.ChatMap.Location.Entities.Location;
import com.ChatMap.Location.Repositories.LocationRepository;

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

	public List<Location> getNearbyLocationsNotCurrent(Double radius) {
		Location currentLocation = this.getCurrentLocation();
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (principal instanceof Integer id)
			return locationRepository.findNearbyLocationsNotCurrent(currentLocation.getLatitude(),
					currentLocation.getLongitude(), radius, id);
		else
			return null;
	}
}
