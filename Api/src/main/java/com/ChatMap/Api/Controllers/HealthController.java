package com.ChatMap.Api.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
public class HealthController {
	@GetMapping("/health")
	public @ResponseBody ResponseEntity<?> health() {
		return ResponseEntity.ok().build();
	}
}