package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/invite")
public class InviteController {
    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> sendInvite(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String inviter = payload.get("inviter");
        String workspaceName = payload.get("workspaceName");
        if (email == null || inviter == null || workspaceName == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }
        emailService.sendInviteEmail(email, inviter, workspaceName);
        return ResponseEntity.ok("Invitation sent");
    }
} 