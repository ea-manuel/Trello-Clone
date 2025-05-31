package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.payload.RegisterRequest;
import com.taskhive.taskhive_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        try {
            User newUser = userService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok("User registered successfully with email: " + newUser.getEmail());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
