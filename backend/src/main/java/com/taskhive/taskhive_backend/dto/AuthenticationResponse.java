package com.taskhive.taskhive_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor // <-- This allows Spring to create the object if needed
public class AuthenticationResponse {
    private String token;
}
