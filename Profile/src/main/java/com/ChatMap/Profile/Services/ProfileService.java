package com.ChatMap.Profile.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ChatMap.Profile.Dto.CreateRequest;
import com.ChatMap.Profile.Entities.Profile;
import com.ChatMap.Profile.Repositories.ProfileRepository;

@Service
public class ProfileService {

	@Autowired
	ProfileRepository profileRepository;

	@Autowired
	JwtService jwtService;

	public Profile saveProfile(CreateRequest createRequest) {
		// TODO add exceptions
		Profile profile = null;

		String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		profile = new Profile(Integer.valueOf(userId), createRequest.getUsername());

		profileRepository.save(profile);

		return profile;
	}

	public String getUsername(String authorizationHeader) {
		Optional<Profile> profileOpt = profileRepository.findById(jwtService.extractUserId(authorizationHeader));

		Profile profile = profileOpt.get();

		return profile.getUsername();
	}
}
