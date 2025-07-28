package com.taskhive.taskhive_backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taskhive.taskhive_backend.dto.AuthenticationResponse;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.payload.LoginRequest;
import com.taskhive.taskhive_backend.payload.RegisterRequest;
import com.taskhive.taskhive_backend.service.AuthService;
import com.taskhive.taskhive_backend.service.JwtService;
import com.taskhive.taskhive_backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        try {
            // Register the user and save them as unverified
            User newUser = userService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());

            // Generate and send OTP
            authService.sendOtpToEmail(newUser.getEmail());

            return ResponseEntity.ok("User registered successfully. OTP sent to email: " + newUser.getEmail());
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

        User user = optionalUser.get();

        if (!user.isVerified()) {
            return ResponseEntity.badRequest().body("Account not verified. Please check your email for the OTP.");
        }

        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthenticationResponse(token));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        try {
            authService.sendOtpToEmail(email);
            return ResponseEntity.ok("OTP sent to your email if it exists.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean verified = authService.verifyOtp(email, otp);
        return verified
                ? ResponseEntity.ok("Account verified successfully.")
                : ResponseEntity.badRequest().body("Invalid OTP.");
    }
}
