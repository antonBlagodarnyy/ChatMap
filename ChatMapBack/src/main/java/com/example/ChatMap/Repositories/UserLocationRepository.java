package com.example.ChatMap.Repositories;

import org.springframework.data.repository.CrudRepository;

import com.example.ChatMap.Entities.UserLocation;

public interface UserLocationRepository extends CrudRepository<UserLocation, Integer> {
	
	
}
