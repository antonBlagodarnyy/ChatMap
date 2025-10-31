package com.ChatMap.Profile.Services;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ChatMap.Profile.Dto.CreateRequest;
import com.ChatMap.Profile.Dto.MultipleUsernamesResponse;
import com.ChatMap.Profile.Dto.UserDataResponse;
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

		Integer userId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		profile = new Profile(userId, createRequest.getUsername());

		profileRepository.save(profile);

		return profile;
	}

	public String getUsername() {
		Integer userId = (Integer) (SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		Optional<Profile> profileOpt = profileRepository.findById(userId);

		Profile profile = profileOpt.get();

		return profile.getUsername();
	}

	// TODO add more data to the profile
	public UserDataResponse getUserData(Integer userId) {
		Optional<Profile> profileOpt = profileRepository.findById(userId);

		Profile profile = profileOpt.get();

		UserDataResponse userDTO = new UserDataResponse(profile.getUsername());
		return userDTO;
	}

	public MultipleUsernamesResponse getMultipleUsernames(List<Integer> ids) {
		HashMap<Integer, String> userNamesMap = new HashMap<>();

		profileRepository.findAllById(ids).forEach((p) -> userNamesMap.put(p.getId(), p.getUsername()));
		MultipleUsernamesResponse multipleUsernamesResponse = new MultipleUsernamesResponse(userNamesMap);
		return multipleUsernamesResponse;
	}
}
