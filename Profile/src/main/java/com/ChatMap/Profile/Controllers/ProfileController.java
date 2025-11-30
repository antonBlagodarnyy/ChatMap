package com.ChatMap.Profile.Controllers;

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

import com.ChatMap.Profile.Dto.CreateRequest;
import com.ChatMap.Profile.Entities.Profile;
import com.ChatMap.Profile.Services.ProfileService;

@Controller
@RequestMapping(path = "/profile")
@RestController
public class ProfileController {

	@Autowired
	ProfileService profileService;

	
	@PostMapping("/create")
	public @ResponseBody ResponseEntity<?> createProfile(@RequestBody CreateRequest createRequest) {
		Profile profile = profileService.saveProfile(createRequest);
		return ResponseEntity.ok(Map.of("username", profile.getUsername()));
	}

	@GetMapping("/currentUsername")
	public @ResponseBody ResponseEntity<?> getCurrentUsername() {
		return ResponseEntity.ok(Map.of("username", profileService.getUsername()));
	}

	@GetMapping("/userData")
	public @ResponseBody ResponseEntity<?> getuserData(@RequestParam Integer userId) {
		// TODO add friend restriction
		return ResponseEntity.ok(Map.of("userData", profileService.getUserData(userId)));
	}

	@GetMapping("/usernamesById")
	public @ResponseBody ResponseEntity<?> getMultipleUsernames(@RequestParam List<Integer> usersIds) {

		return ResponseEntity.ok(profileService.getMultipleUsernames(usersIds));
	}
}
