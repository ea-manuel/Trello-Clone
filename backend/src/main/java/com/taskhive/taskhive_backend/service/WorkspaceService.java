package com.taskhive.taskhive_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.repository.WorkspaceRepository;

@Service
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    public Workspace createWorkspace(Workspace workspace) {
        return workspaceRepository.save(workspace);
    }

    public List<Workspace> getWorkspacesByUser(User user) {
        return workspaceRepository.findByUser(user);
    }
}

