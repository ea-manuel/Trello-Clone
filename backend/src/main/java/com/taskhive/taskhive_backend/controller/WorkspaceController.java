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
        if (userDetails == null) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        User dbUser = userDetails.getUser();
        User managedUser = userRepository.findById(dbUser.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Workspace workspace = new Workspace();
        workspace.setName(request.getName());
        workspace.setOwner(managedUser);
        workspace.addUser(managedUser);

        Workspace created = workspaceService.createWorkspace(workspace);
        return ResponseEntity.ok(created);
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
            