package com.taskhive.taskhive_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.payload.WorkspaceRequest;
import com.taskhive.taskhive_backend.service.WorkspaceService;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    // POST: Create a new workspace
    @PostMapping
    public ResponseEntity<Workspace> createWorkspace(@RequestBody WorkspaceRequest request, @AuthenticationPrincipal User user) {
        String name = request.getName();
        Workspace workspace = new Workspace();
        workspace.setName(name);
        workspace.setUser(user);
        workspaceService.createWorkspace(workspace);
        return ResponseEntity.ok(workspace);
    }

    // GET: Get all workspaces belonging to the authenticated user
    @GetMapping
    public ResponseEntity<List<Workspace>> getUserWorkspaces(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(workspaceService.getWorkspacesByUser(user));
    }
}
