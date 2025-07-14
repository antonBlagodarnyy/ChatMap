package com.example.ChatMap.Repositories;

import org.springframework.data.repository.CrudRepository;

import com.example.ChatMap.Entities.User;

//This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
//CRUD refers Create, Read, Update, Delete

public interface UserRepository extends CrudRepository<User, Integer> {
	User findByUsername(String username);
	Integer findIdByUsername(String username);
}