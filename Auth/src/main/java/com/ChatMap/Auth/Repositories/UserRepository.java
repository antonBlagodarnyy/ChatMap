package com.ChatMap.Auth.Repositories;


import org.springframework.data.repository.CrudRepository;

import com.ChatMap.Auth.Entities.User;


public interface UserRepository extends CrudRepository<User, Integer> {
	User findByEmail(String email);
}