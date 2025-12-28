package com.ChatMap.Api.Repositories;


import org.springframework.data.jpa.repository.JpaRepository;


import com.ChatMap.Api.Entities.User;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Integer> {
	User findByEmail(String email);
	List<User> findByIdNot(Integer id);
}