package com.taskhive.taskhive_backend.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.taskhive.taskhive_backend.service.JwtService;
import com.taskhive.taskhive_backend.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        System.out.println("=== JWT Filter Debug ===");
        System.out.println("Request path: " + request.getServletPath());
        System.out.println("Auth header: " + (authHeader != null ? "present" : "null"));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No valid auth header, continuing without authentication");
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        String email;

        try {
            email = jwtService.extractUsername(token);
            System.out.println("Extracted email from token: " + email);
        } catch (Exception e) {
            System.err.println("Failed to extract username from token: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userService.loadUserByUsername(email);
                System.out.println("Loaded user details for: " + email);

                if (jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Authentication set successfully for user: " + email);
                } else {
                    System.err.println("Token validation failed for user: " + email);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token signature");
                    return;
                }
            } catch (Exception e) {
                System.err.println("Failed to load user details for: " + email + ", Error: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                return;
            }
        } else if (email == null) {
            System.out.println("No email extracted from token");
        } else {
            System.out.println("Authentication already exists for user: " + email);
        }

        filterChain.doFilter(request, response);
    }
}
