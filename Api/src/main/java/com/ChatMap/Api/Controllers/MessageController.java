package com.ChatMap.Api.Controllers;


import com.ChatMap.Api.Dto.SaveMessageRequest;
import com.ChatMap.Api.Services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(messageService.saveMessage(saveMessageRequest));
    }

    @GetMapping("/retrieveMessages")
    public @ResponseBody ResponseEntity<?> retrieveMessages(@RequestParam Integer receiver) {
        return ResponseEntity.ok(messageService.retrieveMessages(receiver));
    }

    @GetMapping("/retrieveChats")
    public @ResponseBody ResponseEntity<?> retrieveConversations() {
        return ResponseEntity.ok(messageService.retrieveOpenedConversations());
    }
}
