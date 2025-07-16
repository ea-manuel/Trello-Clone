package com.taskhive.taskhive_backend.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserProfile(Principal principal) {
        String email = principal.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    // ✅ Update profile picture
    @PutMapping("/profile-picture")
    public ResponseEntity<?> updateProfilePicture(
            @RequestBody ProfilePictureRequest request,
            Principal principal) {

        String email = principal.getName();
        User user = userService.getUserByEmail(email);
        user.setProfilePictureUrl(request.getProfilePictureUrl());
        userService.saveUser(user);

        return ResponseEntity.ok().body("Profile picture updated successfully");
    }

    // ✅ Inner class to map request JSON
    public static class ProfilePictureRequest {
        private String profilePictureUrl;

        public String getProfilePictureUrl() {
            return profilePictureUrl;
        }

        public void setProfilePictureUrl(String profilePictureUrl) {
            this.profilePictureUrl = profilePictureUrl;
        }
    }
}

