package com.example.ChatMap.Controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.ChatMap.Dto.LocationRequest;
import com.example.ChatMap.Entities.User;
import com.example.ChatMap.Entities.UserLocation;
import com.example.ChatMap.Repositories.UserLocationRepository;
import com.example.ChatMap.Repositories.UserRepository;

@Controller
@RequestMapping(path = "/userslocations")
@RestController
public class UserLocationController {

	@Autowired
	private UserLocationRepository userLocationRepository;

	@Autowired
	private UserRepository userRepository;

	@PostMapping(path = "/post")
	public ResponseEntity<?> postLocation(@RequestBody LocationRequest request) {
		// This makes the user entity managed
		User user = userRepository.findById(request.getId()).orElseThrow(() -> new RuntimeException("User not found"));

		UserLocation userLocation = new UserLocation();

		userLocation.setUser(user); // Attach managed entity
		userLocation.setLatitude(request.getLatitude());
		userLocation.setLongitude(request.getLongitude());

		userLocationRepository.save(userLocation);
		return ResponseEntity.ok(userLocation);
	}

	@GetMapping(path = "/getAll")
	public @ResponseBody ResponseEntity<?> getAllLocations() {

		return ResponseEntity.ok(userLocationRepository.findAll());
	}

	@PutMapping(path = "/put")
	public ResponseEntity<?> putLocation(@RequestBody LocationRequest request) {
		System.out.println("diversion");
		final Optional<UserLocation> locationExists = userLocationRepository.findById(request.getId());
		if (locationExists.isPresent()) {
			final UserLocation userLocation = locationExists.get();
			System.out.println(userLocation);
			userLocation.setLatitude(request.getLatitude());
			userLocation.setLongitude(request.getLongitude());

			userLocationRepository.save(userLocation);
			return ResponseEntity.ok(userLocation);
		} else {
			return ResponseEntity.notFound().build();
		}

	}
}
