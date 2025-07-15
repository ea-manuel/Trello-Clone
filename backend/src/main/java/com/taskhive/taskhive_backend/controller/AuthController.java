package com.taskhive.taskhive_backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskhive.taskhive_backend.dto.AuthenticationResponse;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.payload.LoginRequest;
import com.taskhive.taskhive_backend.payload.RegisterRequest;
import com.taskhive.taskhive_backend.service.JwtService;
import com.taskhive.taskhive_backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        try {
            User newUser = userService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok("User registered successfully with email: " + newUser.getEmail());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userService.findByEmail(request.getEmail());

        if (optionalUser.isEmpty() || !userService.checkPassword(request.getPassword(), optionalUser.get().getPassword())) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        String token = jwtService.generateToken(optionalUser.get().getEmail());
        return ResponseEntity.ok(new AuthenticationResponse(token));
    }
}
