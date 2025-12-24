package com.ChatMap.Api.Repositories;


import org.springframework.data.repository.CrudRepository;

import com.ChatMap.Api.Entities.User;


public interface UserRepository extends CrudRepository<User, Integer> {
	User findByEmail(String email);
}