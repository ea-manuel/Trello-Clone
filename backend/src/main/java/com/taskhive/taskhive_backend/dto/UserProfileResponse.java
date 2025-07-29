
package com.taskhive.taskhive_backend.dto;

public class UserProfileResponse {
    private String username;
    private String email;

    // No-args constructor (required for JSON serialization/deserialization)
    public UserProfileResponse() {}

    // All-args constructor
    public UserProfileResponse(String username, String email) {
        this.username = username;
        this.email = email;
    }

    // Getters
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}