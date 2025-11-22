package com.ChatMap.Location.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ChatMap.Location.Dto.CreateLocationRequest;
import com.ChatMap.Location.Entities.Location;
import com.ChatMap.Location.Services.LocationService;

@Controller
@RequestMapping(path = "/location")
@RestController
public class LocationController {

	@Autowired
	LocationService locationService;

	// TODO handle exceptios
	@GetMapping("/health")
	public @ResponseBody ResponseEntity<?> health() {
		return ResponseEntity.ok().build();
	}

	
	@PostMapping("/create")
	public @ResponseBody ResponseEntity<?> createLocation(@RequestBody CreateLocationRequest createLocationRequest) {
		locationService.createLocation(createLocationRequest);

		return ResponseEntity.ok().build();
	}

	@GetMapping("/current")
	public ResponseEntity<?> getCurrentLocation() {
		Location location = locationService.getCurrentLocation();
		if (location != null)
			return ResponseEntity.ok(Map.of("location", location));
		else
			return ResponseEntity.noContent().build();
	}

	@GetMapping("/nearbyNotCurrent")
	public @ResponseBody ResponseEntity<?> getNearbyLocation(@RequestParam Double lat, @RequestParam Double lon, @RequestParam Double radius) {
		List<Location> locations = locationService.getNearbyLocationsNotCurrent(lat,lon, radius);
		return ResponseEntity.ok(Map.of("locations", locations));
	}

}
