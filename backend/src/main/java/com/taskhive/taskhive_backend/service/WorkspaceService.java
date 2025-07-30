package com.taskhive.taskhive_backend.service;

import java.util.List;
import java.util.Optional;

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

    @Autowired
    private EmailService emailService;

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
        System.out.println("=== Invite Debug ===");
        System.out.println("Workspace ID: " + workspaceId);
        System.out.println("Email: " + email);
        
        // Since we're using frontend-only workspaces, we don't need to find a workspace in the database
        // Just send the invitation email and log the activity
        
        // Send invitation email regardless of whether user exists
        String subject = "You've been invited to join TaskHive";
        String body = "Hello,\n\n" +
                     "You have been invited to join TaskHive!\n\n" +
                     "Please sign up for TaskHive and log in to start collaborating.\n\n" +
                     "Best regards,\nTaskHive Team";
        
        System.out.println("Sending email to: " + email);
        emailService.sendReminderEmail(email, subject, body);
        System.out.println("Email sent successfully");

        // Try to find existing user
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User userToInvite = optionalUser.get();
            System.out.println("Found existing user: " + userToInvite.getEmail());
            
            // Log the invitation activity
            // Since we don't have a workspace owner, we'll use the invited user as the activity source
            try {
                activityLogService.logActivity(
                    userToInvite,
                    "Invited user",
                    "Invited " + email + " to TaskHive"
                );
            } catch (Exception e) {
                System.out.println("Error logging activity: " + e.getMessage());
            }
        } else {
            System.out.println("User not found, looking for any user to log activity");
            // User doesn't exist yet, but we still log the invitation
            // We'll need to get any existing user to log the activity
            try {
                Optional<User> anyUser = userRepository.findAll().stream().findFirst();
                if (anyUser.isPresent()) {
                    System.out.println("Found user for activity logging: " + anyUser.get().getEmail());
                    activityLogService.logActivity(
                        anyUser.get(),
                        "Invited user",
                        "Invited " + email + " to TaskHive (user not registered yet)"
                    );
                } else {
                    System.out.println("No users found for activity logging");
                }
            } catch (Exception e) {
                System.out.println("Error finding users for activity logging: " + e.getMessage());
            }
        }

        // Return a dummy workspace object since we don't have a real one
        Workspace dummyWorkspace = new Workspace();
        dummyWorkspace.setName("TaskHive Workspace");
        System.out.println("Returning dummy workspace");
        return dummyWorkspace;
    }

    public List<Workspace> getWorkspacesByUser(User user) {
        return workspaceRepository.findByUsersContaining(user);
    }
}
