package com.example.ChatMap.Services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.ChatMap.Dao.CustomUserDetails;
import com.example.ChatMap.Entities.User;
import com.example.ChatMap.Repositories.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username);
		if (user == null) {
			throw new UsernameNotFoundException("User not found");
		}
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
				new ArrayList<>());
	}

	public Integer getIdByUsername(String username) {
		Integer id = userRepository.findIdByUsername(username);
		if (id == null) {
			throw new UsernameNotFoundException("User not found");
		}
		return id;

	}

	public UserDetails loadUserById(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UsernameNotFoundException("Id of the user: " + id));
		if (user == null) {
			throw new UsernameNotFoundException("User not found");
		}
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
				new ArrayList<>());
	}
}
