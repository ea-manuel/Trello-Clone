package com.taskhive.taskhive_backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.payload.WorkspaceRequest;
import com.taskhive.taskhive_backend.service.UserService;
import com.taskhive.taskhive_backend.service.WorkspaceService;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {
    
    @Autowired
    private WorkspaceService workspaceService;

    @Autowired
    private UserService userService;

    // POST: Create a new workspace
    @PostMapping
    public ResponseEntity<Workspace> createWorkspace(@RequestBody WorkspaceRequest request, Principal principal) {
        String email = principal.getName();
        User user = userService.getUserByEmail(email);

        Workspace workspace = new Workspace();
        workspace.setName(request.getName());
        // workspace.setVisibility(request.getVisibility());
        workspace.setUser(user);

        Workspace savedWorkspace = workspaceService.createWorkspace(workspace);
        return ResponseEntity.status(201).body(savedWorkspace);
    }

    // GET: Get all workspaces belonging to the authenticated user
    @GetMapping
    public ResponseEntity<List<Workspace>> getUserWorkspaces(Principal principal) {
        String email = principal.getName();
        User user = userService.getUserByEmail(email);

        List<Workspace> workspaces = workspaceService.getWorkspacesByUser(user);
        return ResponseEntity.ok(workspaces);
    }

    // DELETE: Delete a workspace by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkspace(@PathVariable Long id, Principal principal) {
        String email = principal.getName();
        User user = userService.getUserByEmail(email);
        workspaceService.deleteWorkspace(id, user);
        return ResponseEntity.noContent().build();
    }
}
