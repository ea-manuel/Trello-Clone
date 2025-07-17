package com.taskhive.taskhive_backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskhive.taskhive_backend.service.JwtService;  // Your JWT service class
import com.taskhive.taskhive_backend.service.UserService;

import java.io.IOException;

@RestController
public class OAuth2LoginController {

    private final JwtService jwtService;
    private final UserService userService;

    public OAuth2LoginController(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @GetMapping("/api/auth/oauth2/success")
    public void oauth2LoginSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        // Extract user info from OAuth2User
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        // Add any other fields you want

        // Check if user exists or create new user
        userService.processOAuthPostLogin(email, name);

        // Generate JWT token for the user
        String jwtToken = jwtService.generateToken(email);

        // Return token to client. Options:
        // 1. Redirect with token as URL param (insecure, but common)
        // 2. Return JSON (if called via AJAX)
        // 3. Set as HTTP cookie

        // Example: redirect with token in URL (change to your frontend URL)
        String redirectUrl = "myapp://login-success?token=" + jwtToken;

        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/api/auth/oauth2/failure")
    public void oauth2LoginFailure(HttpServletResponse response) throws IOException {
        // Redirect to your app’s failure URL or send a JSON error
        String redirectUrl = "myapp://login-failure";
        response.sendRedirect(redirectUrl);
    }
}

