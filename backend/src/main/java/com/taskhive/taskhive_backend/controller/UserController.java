package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.dto.UserProfileResponse;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

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


        UserProfileResponse response = new UserProfileResponse(
            user.getUsername(), // use the username field
            user.getEmail()
        );

        return ResponseEntity.ok(response);
    }
}
