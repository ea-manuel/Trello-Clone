package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.model.ActivityLog;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.service.ActivityLogService;
import com.taskhive.taskhive_backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
public class ActivityLogController {

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private UserService userService;

    // ✅ Create a test log (for testing purposes)
    @PostMapping("/log")
public ResponseEntity<String> logActivity(@RequestBody LogRequest logRequest, @AuthenticationPrincipal User user) {
    activityLogService.logActivity(user, logRequest.getAction(), logRequest.getLocation());
    return ResponseEntity.ok("Activity logged successfully.");
}
    public static class LogRequest {
        private String action;
        private String location;

        // Getters and Setters
        public String getAction() {
            return action;
        }

        public void setAction(String action) {
            this.action = action;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }
    }

    // ✅ Get all logs
    @GetMapping
    public List<ActivityLog> getAllLogs() {
        return activityLogService.getAllLogs();
    }
}
