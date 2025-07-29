user controller
package com.taskhive.taskhive_backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskhive.taskhive_backend.dto.UserProfileResponse;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        String email = authentication.getName(); // extracted from JWT
        Optional<User> optionalUser = userService.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        
        // Debug logging
        System.out.println("=== User Profile Debug ===");
        System.out.println("User ID: " + user.getId());
        System.out.println("User Email: " + user.getEmail());
        System.out.println("User Username (Raw): " + user.getUsernameRaw());
        System.out.println("User Username (Spring): " + user.getUsername());

        UserProfileResponse response = new UserProfileResponse(
            user.getUsernameRaw(), // ✅ fixed: get actual username instead of email
            user.getEmail()
        );
        
        System.out.println("Response Username: " + response.getUsername());
        System.out.println("Response Email: " + response.getEmail());
        System.out.println("=========================");

        return ResponseEntity.ok(response);
    }
}