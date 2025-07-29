package com.taskhive.taskhive_backend.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.repository.UserRepository;
import com.taskhive.taskhive_backend.repository.WorkspaceRepository;
import com.taskhive.taskhive_backend.security.CustomUserDetails;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WorkspaceRepository workspaceRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, WorkspaceRepository workspaceRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new CustomUserDetails(user);
    }

    @Transactional
    public User registerUser(String username, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        // Save user first to generate ID and ensure it's persisted
        User savedUser = userRepository.save(user);
        System.out.println("User saved with ID: " + savedUser.getId() + ", Email: " + savedUser.getEmail());

        // Flush to ensure the user is committed to the database
        userRepository.flush();

        try {
            // Create workspace and link to saved user
            Workspace defaultWorkspace = new Workspace();
            defaultWorkspace.setName("My Workspace");
            defaultWorkspace.setOwner(savedUser);
            defaultWorkspace.addUser(savedUser);

            workspaceRepository.save(defaultWorkspace);
            workspaceRepository.flush(); // Ensure workspace is committed
            System.out.println("Successfully created default workspace for user: " + email + " (ID: " + savedUser.getId() + ")");
        } catch (Exception e) {
            // If workspace creation fails, still return the user but log the error
            System.err.println("Failed to create default workspace for user: " + email + " (ID: " + savedUser.getId() + "). Error: " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception to allow user registration to succeed
        }

        return savedUser;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public boolean userExistsInDatabase(Long id) {
        return userRepository.findById(id).isPresent();
    }

    // Method to check and clean up orphaned workspace records
    public void cleanupOrphanedWorkspaces() {
        try {
            // This would need to be implemented in WorkspaceRepository
            // For now, just log that we're checking
            System.out.println("Checking for orphaned workspace records...");
        } catch (Exception e) {
            System.err.println("Error cleaning up orphaned workspaces: " + e.getMessage());
        }
    }
}
