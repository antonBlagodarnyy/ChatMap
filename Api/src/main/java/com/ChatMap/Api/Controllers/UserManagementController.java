package com.ChatMap.Api.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ChatMap.Api.Services.AuthService;

@Controller
@RequestMapping(path = "/userManagement")
@RestController
public class UserManagementController {
	
	@Autowired
	private AuthService authService;
	
	@PostMapping(path = "/delete")
	public @ResponseBody ResponseEntity<Void> deleteUser()
			throws Exception {
		authService.deleteUser();
		return ResponseEntity.ok().build();
	}
}
