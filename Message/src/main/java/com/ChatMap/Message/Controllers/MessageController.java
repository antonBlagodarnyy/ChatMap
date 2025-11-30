package com.ChatMap.Message.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ChatMap.Message.Dto.SaveMessageRequest;
import com.ChatMap.Message.Services.MessageService;

@Controller
@RequestMapping(path = "/message")
@RestController
public class MessageController {

	@Autowired
	private MessageService messageService;

	
	@GetMapping("/health")
	public @ResponseBody ResponseEntity<?> health() {
		return ResponseEntity.ok().build();
	}

	
	@PostMapping("/save")
	public @ResponseBody ResponseEntity<?> saveMessage(@RequestBody SaveMessageRequest saveMessageRequest) {
		messageService.saveMessage(saveMessageRequest);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/retrieveMessages")
	public @ResponseBody ResponseEntity<?> retrieveMessages(@RequestParam Integer receiver) {
		return ResponseEntity.ok(messageService.retrieveMessages(receiver));
	}
	@GetMapping("/retrieveConversations")
	public @ResponseBody ResponseEntity<?> retrieveConversations() {
		return ResponseEntity.ok(messageService.retrieveOpenedConversations());
	}
}
