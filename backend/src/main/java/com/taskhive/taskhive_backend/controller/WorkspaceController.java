package com.taskhive.taskhive_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.payload.InviteUserRequest;
import com.taskhive.taskhive_backend.payload.WorkspaceRequest;
import com.taskhive.taskhive_backend.repository.UserRepository;
import com.taskhive.taskhive_backend.security.CustomUserDetails;
import com.taskhive.taskhive_backend.service.WorkspaceService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createWorkspace(@RequestBody WorkspaceRequest request,
                                             @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            System.out.println("=== Workspace Creation Debug ===");
            System.out.println("Request name: " + request.getName());
            
            if (userDetails == null) {
                System.out.println("ERROR: userDetails is null");
                return ResponseEntity.status(403).body("Unauthorized");
            }

            User dbUser = userDetails.getUser();
            System.out.println("User from authentication: " + (dbUser != null ? "ID=" + dbUser.getId() + ", Email=" + dbUser.getEmail() : "null"));
            
            if (dbUser == null || dbUser.getId() == null) {
                System.out.println("ERROR: Invalid user authentication - user or user ID is null");
                return ResponseEntity.status(403).body("Invalid user authentication");
            }

            // Check if user exists in database
            boolean userExists = userRepository.existsById(dbUser.getId());
            System.out.println("User exists in database: " + userExists + " (ID: " + dbUser.getId() + ")");
            
            if (!userExists) {
                System.err.println("ERROR: User with ID " + dbUser.getId() + " does not exist in database");
                return ResponseEntity.status(403).body("User not found in database");
            }

            // Try to find the user in the database to ensure it exists
            User managedUser = userRepository.findById(dbUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dbUser.getId()));
            
            System.out.println("User found in database: " + managedUser.getEmail() + " (ID: " + managedUser.getId() + ")");

            Workspace workspace = new Workspace();
            workspace.setName(request.getName());
            workspace.setOwner(managedUser);
            workspace.addUser(managedUser);

            Workspace created = workspaceService.createWorkspace(workspace);
            System.out.println("Workspace created successfully: " + created.getName() + " (ID: " + created.getId() + ")");
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            System.err.println("ERROR creating workspace: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating workspace: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("UNEXPECTED ERROR creating workspace: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/invite")
    public ResponseEntity<?> inviteUser(@RequestBody InviteUserRequest request,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        Workspace updated = workspaceService.inviteUserToWorkspace(request.getWorkspaceId(), request.getEmail());
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<?> getUserWorkspaces(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        List<Workspace> workspaces = workspaceService.getWorkspacesByUser(userDetails.getUser());
        return ResponseEntity.ok(workspaces);
    }
}
            