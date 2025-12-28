package com.ChatMap.Api.Controllers;

import com.ChatMap.Api.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path = "/user")
@RestController
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping(path = "/getUsersThumbnails")
    public @ResponseBody ResponseEntity<?> getUsersThumbnails() {
        return ResponseEntity.ok(userService.getUsersThumbnails());
    }
}
