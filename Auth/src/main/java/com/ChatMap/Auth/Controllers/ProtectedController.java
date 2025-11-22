package com.ChatMap.Auth.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ChatMap.Auth.Services.AuthService;

@Controller
@RequestMapping(path = "/protected")
@RestController
public class ProtectedController {
	
	@Autowired
	private AuthService authService;
	
	@PostMapping(path = "/delete")
	public @ResponseBody ResponseEntity<Void> deleteUser()
			throws Exception {
		authService.deleteUser();
		return ResponseEntity.ok().build();
	}
}
