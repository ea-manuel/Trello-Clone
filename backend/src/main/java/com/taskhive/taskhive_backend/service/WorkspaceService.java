package com.taskhive.taskhive_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.repository.UserRepository;
import com.taskhive.taskhive_backend.repository.WorkspaceRepository;

@Service
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public Workspace createWorkspace(Workspace workspace) {
        Workspace savedWorkspace = workspaceRepository.save(workspace);

        activityLogService.logActivity(
            workspace.getOwner(),
            "Created workspace",
            "Workspace: " + savedWorkspace.getName()
        );

        return savedWorkspace;
    }

    public Workspace inviteUserToWorkspace(Long workspaceId, String email) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow(() -> new RuntimeException("Workspace not found"));

        User userToInvite = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (!workspace.getUsers().contains(userToInvite)) {
            workspace.addUser(userToInvite);

            activityLogService.logActivity(
                workspace.getOwner(),
                "Invited user",
                "Invited " + email + " to workspace: " + workspace.getName()
            );
        }

        return workspaceRepository.save(workspace);
    }

    public List<Workspace> getWorkspacesByUser(User user) {
        return workspaceRepository.findByUsersContaining(user);
    }
}
