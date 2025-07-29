package com.taskhive.taskhive_backend.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.repository.UserRepository;
import com.taskhive.taskhive_backend.security.CustomUserDetails;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.taskhive.taskhive_backend.repository.WorkspaceRepository workspaceRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, com.taskhive.taskhive_backend.repository.WorkspaceRepository workspaceRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.workspaceRepository = workspaceRepository;
    }

   @Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    return new CustomUserDetails(user); // ✅ Wrap user in CustomUserDetails
}


    public User registerUser(String username, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);

        // Create default workspace for new user
        com.taskhive.taskhive_backend.model.Workspace defaultWorkspace = new com.taskhive.taskhive_backend.model.Workspace();
        defaultWorkspace.setName("My Workspace");
        defaultWorkspace.setOwner(savedUser);
        defaultWorkspace.addUser(savedUser);
        workspaceRepository.save(defaultWorkspace);

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

}
